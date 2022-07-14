export default class Monitor {
  static exceptions(){
    process.on('uncaughtException')
    process.on('unhandledRejection')
    process.on('uncaughtExceptionMonitor')
  }
}
