import { createUnplugin } from 'unplugin';
import { PluginOptions } from './core/types';
import path from 'path-browserify';
import { composeConsoleLog } from './core/composeConsoleLog';
import { transform, parseSync, traverse } from '@babel/core';
import fs from 'node:fs';
import { startServer } from './server/server';

const PORT = 3070;

const unpluginFactory = (options: PluginOptions = {}): any => {
  return {
    name: 'vite-console-debug',
    configureServer() {
      if (options.disableLaunchEditor) return;

      startServer(PORT);
    },
    transform(code, id) {
      const { exclude = ['node_modules'], noConsole = false } = options;
      const projectDir = path.join(process.cwd());
      const port = PORT;

      const pos: any = [];

      if (exclude.length) {
        for (let i = 0; i < exclude.length; i += 1) {
          const fileDir = path.join(projectDir, exclude[i]).replace(/\\/g, '/');

          if (id.startsWith(fileDir)) {
            return { code };
          }
        }
      }

      const fileSuffixReg = /.*\.(js|cjs|mjs|jsx|ts|tsx)$/;

      if (!fileSuffixReg.test(id)) return;

      const codeList = code.split(/\r?\n/);
      const consoleReg = /console\.log\(/;
      let lineCount = 1;
      let resultCode = '';

      const isConsoleLog = codeList.some(
        (token) => token.search(consoleReg) >= 0,
      );

      if (!isConsoleLog) {
        return { code };
      }

      if (noConsole) {
        const codeTransform = transform(code, {
          plugins: [['transform-remove-console', { exclude: ['error'] }]],
        });

        return { code: codeTransform?.code ?? code };
      }

      const originCode = fs.readFileSync(id, 'utf-8');

      const ast = parseSync(originCode, {
        configFile: false,
        filename: id,
        ast: true,
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      });

      traverse(ast, {
        enter({ node }) {
          if (
            node.type === 'MemberExpression' &&
            node.object.name === 'console' &&
            node.property.name === 'log'
          ) {
            pos.push(node.property.loc.start.line);
          }
        },
      });

      codeList.forEach((token) => {
        if (token.search(consoleReg) >= 0) {
          const fileRelativePath = id.replace(
            projectDir.replace(/\\/g, '/'),
            '',
          );

          const prefix = token.slice(
            token.search(consoleReg),
            12 + token.search(consoleReg),
          );

          const suffix = token.slice(12 + token.search(consoleReg));

          const ret = composeConsoleLog({
            prefix,
            suffix,
            fileRelativePath,
            fileAbsolutePath: id,
            lineCount: pos[0] ?? lineCount,
            endCloumn: token.length + 1,
            port: port,
          });

          pos.shift();

          resultCode += `${ret}\n`;
        } else {
          resultCode += `${token}\n`;
        }
        lineCount += 1;
      });

      return { code: resultCode };
    },
  };
};

export const VitePluginResizeImage =
  /* #__PURE__ */ createUnplugin(unpluginFactory);

export default VitePluginResizeImage;
