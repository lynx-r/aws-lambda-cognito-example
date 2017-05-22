// import Server = SocketIO.Server;
// import {log} from "util";
// import server = require("socket.io");
// import ServerOptions = SocketIO.ServerOptions;
// import {AppConstants} from "./app-constants";
// import {AppService} from "./app.service";
//
// export class SocketService {
//   private listener: Server;
//   private serverOptions: ServerOptions = {};
//   private appService: AppService;
//
//   constructor() {
//     this.appService = AppService.INSTANCE;
//     this.listener = server(4000, this.serverOptions);
//
//     this.listener.on('connection', (socket) => {
//       log('a user connected');
//       socket.on('disconnect', () => {
//         log('the user disconnected');
//       });
//
//       socket.on(AppConstants.HIGHLIGHT, (req: any, callback: Function) => {
//         this.appService.highlight(req, callback);
//       });
//
//       socket.on(AppConstants.MOVE_DRAUGHT_TO, (req: any, callback: Function) => {
//         this.appService.moveDraughtTo(req, callback);
//       });
//
//       socket.on(AppConstants.ADD_DRAUGHT, (req: any, callback: Function) => {
//         this.appService.addDraught(req, callback);
//       });
//
//       socket.on(AppConstants.REMOVE_DRAUGHT, (req: any, callback: Function) => {
//         this.appService.removeDraught(req, callback);
//       });
//
//       socket.on(AppConstants.FILL_IN_BOARD, (req: any, callback: Function) => {
//         this.appService.fillInBoard(req, callback);
//       });
//
//       socket.on(AppConstants.CREATE_ARTICLE, (req, callback: Function) => {
//         this.appService.createArticle(req, callback);
//       });
//
//       socket.on(AppConstants.FIND_ARTICLES, (req, callback: Function) => {
//         // this.appService.findArticles(callback);
//       });
//
//       socket.on(AppConstants.FIND_ARTICLE, (req, callback: Function) => {
//         this.appService.findArticle(req, callback);
//       });
//
//       socket.on(AppConstants.UPDATE_ARTICLE, (req, callback: Function) => {
//         this.appService.updateArticle(req, callback);
//       });
//
//       socket.on(AppConstants.CLEAR_BOARD, (req, callback: Function) => {
//         this.appService.clearBoard(req, callback);
//       });
//
//       socket.on(AppConstants.REMOVE_ARTICLE, (req, callback: Function) => {
//         this.appService.removeArticle(req, callback);
//       });
//
//     });
//   }
//
// }
