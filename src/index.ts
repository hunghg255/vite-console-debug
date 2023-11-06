import { createUnplugin } from 'unplugin';
import { PluginOptions } from './core/types';
import path from 'path-browserify';
import { composeConsoleLog } from './core/composeConsoleLog';
import { transform, parseSync, traverse } from '@babel/core';
import fs from 'node:fs';

const unpluginFactory = (options: PluginOptions = {}): any => {
  let s;

  return {
    name: 'vite-console-debug',
    configureServer(server) {
      s = server;
    },
    transform(code, id) {
      const { exclude = ['node_modules'] } = options;
      const projectDir = path.join(process.cwd());
      const port = s?.config?.server?.port;

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

      if (options.noConsole && fileSuffixReg.test(id)) {
        const codeTransform = transform(code, {
          plugins: [['transform-remove-console', { exclude: ['error'] }]],
        });

        return { code: codeTransform?.code ?? code };
      }

      if (fileSuffixReg.test(id)) {
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
              jump: !!port,
            });

            pos.shift();

            resultCode += `${ret}\n`;
          } else {
            resultCode += `${token}\n`;
          }
          lineCount += 1;
        });
        return { code: resultCode };
      }

      return { code };
    },
  };
};

export const VitePluginResizeImage =
  /* #__PURE__ */ createUnplugin(unpluginFactory);

export default VitePluginResizeImage;
