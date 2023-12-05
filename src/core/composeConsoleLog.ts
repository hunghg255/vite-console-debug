import { Buffer } from 'node:buffer';

const BaseURL = 'http://localhost:';
const middlewareName = 'client';

/**
 *
 * @returns {string}
 */
export function generateTime() {
  const date = new Date();
  const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
  const minutes =
    date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
  const seconds =
    date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
  return `${hour}:${minutes}:${seconds}`;
}

/**
 *
 * @returns {string}
 */
export function generateLogTitle() {
  return `"%c[CONSOLE-LINE - ${generateTime()}]:`;
}

/**
 *
 * @returns {string}
 */
export function generateLogTitleStyle() {
  return `"color:#2EB086;padding:2px 5px;font-weight:700;"`;
}

/**
 *
 * @param {string} location
 * @returns {string}
 */
export function generateFileLocation(location) {
  return `%cFile: ${location}  `;
}

/**
 *
 * @returns {string}
 */
export function generateFileLocationStyle() {
  return `"color: #3AB4F2;"`;
}

/**
 *
 * @param {number}} lineCount
 * @returns {string}
 */
export function generateLine(lineCount) {
  return `%cLine: ${lineCount}\\n`;
}

export function generateLineStyle() {
  return `"color: #F4CE14;"`;
}

/**
 *
 * @param {number|string} port
 * @param {string} filePath
 * @returns {string}
 */
export function generateAddress(port, filePath) {
  return `%cJump to: ${BaseURL + port}/${middlewareName}#${Buffer.from(
    filePath,
    'utf-8',
  ).toString('base64')}\\n`;
}

/**
 *
 * @returns {string}
 */
export function generateAddressStyle() {
  return `"color: #6664C2;"`;
}

/**
 *
 * @returns {string}
 */
export function generateNewLine() {
  return '%c\\n"';
}

/**
 *
 * @returns {string}
 */
export function generateNewLineStyle() {
  return `"color: inherit"`;
}

/**
 * @param {Object} components
 * @param {string} components.prefix
 * @param {string} components.suffix
 * @param {string} components.fileRelativePath
 * @param {string} components.fileAbsolutePath
 * @param {number} components.lineCount
 * @param {number} components.endCloumn
 * @param {number|string} components.port
 * @param {boolean} components.jump
 * @returns {string}
 */
export function composeConsoleLog(components) {
  const {
    prefix,
    suffix,
    fileRelativePath,
    fileAbsolutePath,
    lineCount,
    endCloumn,
    port,
    jump,
  } = components;
  return `${
    prefix +
    generateLogTitle() +
    generateFileLocation(fileRelativePath) +
    generateLine(lineCount) +
    (jump
      ? generateAddress(
          port,
          encodeURIComponent(`${fileAbsolutePath}:${lineCount}:${endCloumn}`),
        )
      : '') +
    `${generateNewLine()},` +
    `${generateLogTitleStyle()},` +
    `${generateFileLocationStyle()},` +
    `${generateLineStyle()},` +
    (jump ? `${generateAddressStyle()},` : '') +
    `${generateNewLineStyle()},` +
    suffix
  }`;
}
