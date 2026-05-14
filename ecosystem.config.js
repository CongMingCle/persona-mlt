/**
 * PM2 Ecosystem 配置文件
 * =======================
 *
 * 启动:
 *   pm2 start ecosystem.config.js
 *
 * 查看状态:
 *   pm2 status
 *
 * 查看日志:
 *   pm2 logs persona-webhook
 *
 * 保存配置（开机自启）:
 *   pm2 save
 *   pm2 startup
 *
 * 重新加载（更新代码后）:
 *   pm2 reload ecosystem.config.js
 */

export default {
  apps: [
    {
      name: 'persona-webhook',
      script: './webhook.js',
      cwd: '/var/www/persona-mlt',

      // 进程管理
      instances: 1,
      exec_mode: 'fork',

      // 日志
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,

      // 自动重启
      watch: false,                // 不监听文件变更重启
      autorestart: true,           // 进程崩溃自动重启
      max_restarts: 10,            // 10 次内重启失败则停止
      restart_delay: 5000,         // 重启间隔 5 秒
      min_uptime: '10s',           // 运行不足 10 秒算启动失败

      // 资源限制
      max_memory_restart: '200M',  // 内存超过 200MB 自动重启

      // 环境变量
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
