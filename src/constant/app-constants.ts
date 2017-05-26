export class AppConstants {
  static JWT_SECRET: string = 'abc';
  static TOKEN_EXPIRES: number = 3600 * 6;
  static APP_NAME: string = 'mySandbox API Server';
  // NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
  // due to a compressed response (e.g. gzip) which has not been handled correctly
  // by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
  // binaryMimeTypes below, then redeploy (`npm run package-deploy`)
  static BINARY_MIME_TYPES: string[] = [
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/xml',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml'
  ];

}
