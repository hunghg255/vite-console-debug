import { transform, parseSync, traverse } from '@babel/core';
import path from 'path-browserify';
import { createUnplugin } from 'unplugin';
import { composeConsoleLog } from './core/composeConsoleLog';
import { PluginOptions } from './core/types';

import MagicString from 'magic-string';

const unpluginFactory = (options: PluginOptions = {}): any => {
  return {
    name: 'vite-console-debug',
    enforce: options.noConsole ? 'post' : 'pre',
    transform(code, id) {
      const {
        exclude = ['node_modules'],
        port = 5173,
        noConsole = false,
      } = options;
      const projectDir = path.join(process.cwd());

      if (exclude.length) {
        for (let i = 0; i < exclude.length; i += 1) {
          const fileDir = path.join(projectDir, exclude[i]).replace(/\\/g, '/');

          if (id.startsWith(fileDir)) {
            return { code };
          }
        }
      }

      const fileSuffixReg = /.*\.(js|cjs|mjs|jsx|ts|tsx)$/;

      if (!fileSuffixReg.test(id)) {
        return {
          code,
        };
      }

      const codeList = code.split(/\r?\n/);
      const consoleReg = /console\.log\(/;

      const isConsoleLog = codeList.some(
        (token) => token.search(consoleReg) >= 0,
      );

      if (!isConsoleLog) {
        return { code };
      }

      const s = new MagicString(code);

      const fileRelativePath = id.replace(projectDir.replace(/\\/g, '/'), '');

      const ast = parseSync(code, {
        configFile: false,
        filename: id,
        ast: true,
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      });

      if (noConsole) {
        const codeTransform = transform(code, {
          plugins: [['transform-remove-console', { exclude: ['error'] }]],
        });

        return { code: codeTransform?.code ?? code };
      }

      traverse(ast, {
        enter({ node }) {
          if (
            node.type === 'CallExpression' &&
            node.callee &&
            node.callee.property &&
            node.callee.object &&
            node.callee.object.name === 'console' &&
            node.callee.property.name === 'log'
          ) {
            const ret = composeConsoleLog({
              fileRelativePath,
              fileAbsolutePath: id,
              lineCount: node.loc.start.line,
              endCloumn: node.loc.start.column + 1,
              port,
            });
            s.appendLeft(node.callee.start + 12, ret);
          }
        },
      });

      return { code: s.toString() };
    },
  };
};

export const VitePluginResizeImage =
  /* #__PURE__ */ createUnplugin(unpluginFactory);

export default VitePluginResizeImage;
