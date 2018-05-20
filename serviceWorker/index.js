class ServiceWorkerManager {
    worker: Object = null

    attach(worker: Object, requestPermission: Function) {
        this.worker = worker
        requestPermission()
    }

    sendNotification(title: string, options?: Object) {
        this.worker.showNotification(title, options)
    }
}

export default new ServiceWorkerManager()
