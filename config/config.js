// 參數設置
module.exports = {
    // 伺服器port
    PORT: process.env.PORT || 3000,
    // cookie
    cookieSecret: 'riLbqTemd3NAdUBwUU7nfsuteqwapN',
    // MongoDB
    mongo: {
        // 開發時用的資料庫
        'development': {
            connectionString: 'mongodb://127.0.0.1/blog'
        },
        // 上線時用的資料庫
        'production': {
            connectionString: 'mongodb://127.0.0.1/blog' //暫時一致
        },
        opts: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    }
};