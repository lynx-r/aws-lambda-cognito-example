export class AppConstants {
  static CREATE_ARTICLE: string = 'create article';
  static FIND_ARTICLES: string = 'find articles';
  static FIND_ARTICLE: string = 'find article';
  static UPDATE_ARTICLE: string = 'update article';
  static FILL_IN_BOARD: string = 'fill in board';
  static CLEAR_BOARD: string = 'clear board';
  static REMOVE_ARTICLE: string = 'remove article';
  static HIGHLIGHT: string = 'highlight';
  static MOVE_DRAUGHT_TO: string = 'move draught to';
  static ADD_DRAUGHT: string = 'add draught';
  static REMOVE_DRAUGHT: string = 'remove draught';
  static JWT_SECRET: string = 'abc';
  static TOKEN_EXPIRES: number = 3600 * 6;
  static APP_NAME: string = 'shashki.online API Server';
  static APP_SETTINGS_DIR: string = '.mysandbox';
  static USER_HOME: string = '/Users/aleksey/';
  static LOG_PATH: string = AppConstants.USER_HOME + AppConstants.APP_SETTINGS_DIR + '/logs/server.log';
  static PATH_TO_SERVER_CERTIFICATE: string = AppConstants.USER_HOME + AppConstants.APP_SETTINGS_DIR + '/ssl/server.crt';
  static PATH_TO_SERVER_KEY: string = AppConstants.USER_HOME + AppConstants.APP_SETTINGS_DIR + '/ssl/server.key';
}
