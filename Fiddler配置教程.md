# Fiddler 配置教程 - 美团外卖店铺图片提取

本文档详细说明如何配置 Fiddler 抓包工具,自动保存美团外卖 APP 的店铺数据为 JSON 文件,供图片提取系统使用。

---

## 📋 目录

- [环境准备](#环境准备)
- [Fiddler 安装与配置](#fiddler-安装与配置)
- [FiddlerScript 配置](#fiddlerscript-配置)
- [手机端配置](#手机端配置)
- [测试验证](#测试验证)
- [常见问题](#常见问题)

---

## 环境准备

### 所需软件

1. **Fiddler Classic** (Windows)
   - 下载地址: https://www.telerik.com/fiddler/fiddler-classic
   - 版本要求: v5.0 或更高

2. **美团外卖 APP** (手机端)
   - iOS 或 Android 均可
   - 建议使用最新版本

### 系统要求

- **操作系统**: Windows 7/8/10/11
- **网络**: 手机和电脑在同一局域网(同一 Wi-Fi)
- **权限**: 管理员权限(用于配置证书)

---

## Fiddler 安装与配置

### 第一步:安装 Fiddler

1. 下载 Fiddler Classic 安装包
2. 以**管理员身份**运行安装程序
3. 按照向导完成安装

### 第二步:启用 HTTPS 解密

1. 打开 Fiddler
2. 点击菜单 `Tools` → `Options`
3. 切换到 `HTTPS` 标签
4. 勾选以下选项:
   - ✅ `Capture HTTPS CONNECTs`
   - ✅ `Decrypt HTTPS traffic`
5. 弹出证书安装提示时,点击 `Yes` 安装证书
6. 在 "Decrypt HTTPS traffic from" 下拉框中选择 `...all processes`

### 第三步:配置远程连接

1. 在 `Options` 窗口切换到 `Connections` 标签
2. 勾选 `Allow remote computers to connect`
3. 记录 Fiddler 监听端口(默认 `8888`)
4. 点击 `OK` 保存设置
5. **重启 Fiddler** 使配置生效

### 第四步:获取电脑 IP 地址

**Windows 系统:**

```bash
# 打开命令提示符(Win + R, 输入 cmd)
ipconfig

# 查找 "无线局域网适配器 WLAN" 或 "以太网适配器"
# 记录 IPv4 地址,例如: 192.168.1.100
```

---

## FiddlerScript 配置

### 自动保存 JSON 文件

Fiddler 使用 FiddlerScript (基于 JScript.NET) 来自定义请求处理逻辑。

#### 第一步:打开 FiddlerScript 编辑器

1. 点击 Fiddler 菜单 `Rules` → `Customize Rules...`
2. 或者按快捷键 `Ctrl + R`
3. 会打开内置的脚本编辑器

#### 第二步:添加自动保存脚本

在 `OnBeforeResponse` 函数中添加以下代码:

```javascript
static function OnBeforeResponse(oSession: Session) {
    // ====== 原有代码保持不变 ======

    // ====== 以下是新增的美团外卖数据保存代码 ======

    // 检查是否是美团外卖店铺详情接口
    if (oSession.uriContains("wmapi.meituan.com") &&
        oSession.uriContains("/poi/food")) {

        try {
            // 获取响应体内容
            var responseBody = oSession.GetResponseBodyAsString();

            // 检查是否包含店铺信息
            if (responseBody.indexOf("poi_info") > -1 ||
                responseBody.indexOf("poi_base_info") > -1) {

                // 定义保存路径(可根据需要修改)
                var savePath = "E:\\美团外卖数据\\latest_poi_food.json";

                // 确保目录存在
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var folder = "E:\\美团外卖数据";
                if (!fso.FolderExists(folder)) {
                    fso.CreateFolder(folder);
                }

                // 保存 JSON 文件(覆盖模式)
                var file = fso.CreateTextFile(savePath, true, false);
                file.Write(responseBody);
                file.Close();

                // 在 Fiddler 日志中显示保存成功
                FiddlerObject.log("✓ 美团店铺数据已保存: " + savePath);
            }
        }
        catch (e) {
            // 错误处理
            FiddlerObject.log("✗ 保存失败: " + e.message);
        }
    }
}
```

#### 第三步:保存并应用脚本

1. 按 `Ctrl + S` 保存脚本
2. Fiddler 会自动重新加载脚本
3. 查看底部状态栏,确认没有语法错误

### 脚本说明

| 配置项 | 说明 | 可修改 |
|--------|------|--------|
| `wmapi.meituan.com` | 美团 API 域名 | ❌ 不建议修改 |
| `/poi/food` | 店铺详情接口路径 | ❌ 不建议修改 |
| `E:\\美团外卖数据\\` | JSON 保存目录 | ✅ 可根据需要修改 |
| `latest_poi_food.json` | 文件名 | ✅ 可修改,但需同步更新系统配置 |

⚠️ **重要提示**:
- 路径中的反斜杠必须使用双反斜杠 `\\` 转义
- 修改保存路径后,需要同步修改图片提取系统的配置

---

## 手机端配置

### iOS 设备配置

#### 第一步:配置 Wi-Fi 代理

1. 打开 `设置` → `无线局域网`
2. 点击已连接 Wi-Fi 右侧的 `ⓘ` 图标
3. 滚动到底部,点击 `配置代理`
4. 选择 `手动`
5. 填写代理信息:
   - **服务器**: 电脑 IP 地址 (例如 `192.168.1.100`)
   - **端口**: `8888`
6. 点击 `存储`

#### 第二步:安装 Fiddler 证书

1. 在手机浏览器中访问: `http://电脑IP:8888`
   - 例如: `http://192.168.1.100:8888`
2. 点击页面中的 `FiddlerRoot certificate` 下载证书
3. 按照系统提示安装证书:
   - 进入 `设置` → `通用` → `VPN与设备管理`
   - 点击下载的证书,选择 `安装`
4. 启用证书信任:
   - 进入 `设置` → `通用` → `关于本机` → `证书信任设置`
   - 开启 `FiddlerRoot` 证书的信任

### Android 设备配置

#### 第一步:配置 Wi-Fi 代理

1. 打开 `设置` → `WLAN`
2. 长按已连接的 Wi-Fi,选择 `修改网络`
3. 勾选 `显示高级选项`
4. 代理设置选择 `手动`
5. 填写代理信息:
   - **代理主机**: 电脑 IP 地址 (例如 `192.168.1.100`)
   - **代理端口**: `8888`
6. 点击 `保存`

#### 第二步:安装 Fiddler 证书

1. 在手机浏览器中访问: `http://电脑IP:8888`
2. 下载并安装证书:
   - 点击 `FiddlerRoot certificate`
   - 保存为 `fiddler.crt`
3. 安装证书:
   - 打开 `设置` → `安全` → `加密与凭据`
   - 点击 `从存储设备安装`
   - 选择下载的证书文件
   - 设置证书名称(例如 `Fiddler`)
   - 凭据用途选择 `VPN 和应用`

---

## 测试验证

### 第一步:启动 Fiddler

1. 确保 Fiddler 正在运行
2. 查看状态栏是否显示 `Capturing` 状态
3. 如果未显示,点击左下角的 `Capturing` 按钮启用抓包

### 第二步:测试手机连接

1. 在手机浏览器中访问: `http://www.baidu.com`
2. 在 Fiddler 中应该能看到捕获的 HTTP 请求
3. 如果没有看到请求,请检查:
   - 手机代理配置是否正确
   - Fiddler 是否允许远程连接
   - 防火墙是否阻止了 8888 端口

### 第三步:测试美团数据抓取

1. 打开手机上的**美团外卖 APP**
2. 浏览任意一家店铺的详情页
3. 等待页面完全加载

**验证方式一: 查看 Fiddler 日志**
- 在 Fiddler 底部的 `Log` 标签中查找:
  ```
  ✓ 美团店铺数据已保存: E:\美团外卖数据\latest_poi_food.json
  ```

**验证方式二: 检查文件是否生成**
- 打开文件夹 `E:\美团外卖数据\`
- 检查是否有 `latest_poi_food.json` 文件
- 使用文本编辑器打开,确认是 JSON 格式的店铺数据

### 第四步:测试图片提取系统

1. 启动图片提取系统(本地版或 GitHub Pages 版)
2. 上传刚才保存的 JSON 文件(新版本)
3. 查看是否成功提取到店铺图片

---

## 常见问题

### ❌ Fiddler 无法捕获手机流量

**可能原因:**
1. 手机和电脑不在同一网络
2. 防火墙阻止了 8888 端口
3. 代理配置错误

**解决方案:**
```bash
# Windows: 添加防火墙入站规则
1. 打开 Windows 防火墙
2. 高级设置 → 入站规则 → 新建规则
3. 规则类型: 端口
4. 协议: TCP, 端口: 8888
5. 操作: 允许连接
```

或者**临时关闭防火墙**测试(不推荐)

### ❌ HTTPS 流量显示为 "Tunnel to..."

**原因**: 未启用 HTTPS 解密

**解决方案:**
1. Fiddler → `Tools` → `Options` → `HTTPS`
2. 勾选 `Decrypt HTTPS traffic`
3. 安装证书
4. 重启 Fiddler

### ❌ 手机提示"证书不可信"

**iOS 解决方案:**
- 确认已在 `证书信任设置` 中启用证书信任

**Android 解决方案:**
- Android 7.0+ 需要在应用的 `network_security_config.xml` 中信任用户证书
- 或使用旧版 Android 系统测试

### ❌ JSON 文件未生成

**排查步骤:**

1. **检查 URL 匹配**
   - 在 Fiddler 中查找包含 `wmapi.meituan.com` 和 `/poi/food` 的请求
   - 如果没有,可能 URL 已变化,需要更新脚本

2. **检查脚本语法**
   - 查看 Fiddler 底部的 `Log` 标签是否有错误信息
   - 常见错误: 路径分隔符错误、变量未定义

3. **检查文件权限**
   - 确保 `E:\美团外卖数据\` 目录存在且可写
   - 以管理员身份运行 Fiddler

4. **手动测试脚本**
   - 在 `OnBeforeResponse` 函数开头添加调试日志:
     ```javascript
     FiddlerObject.log("✓ 捕获请求: " + oSession.fullUrl);
     ```
   - 重新加载脚本,浏览美团店铺,查看日志输出

### ❌ 保存的 JSON 文件格式错误

**可能原因:**
- 响应体被压缩(gzip/deflate)
- 编码问题

**解决方案:**

修改脚本,添加自动解压缩:

```javascript
// 获取响应体内容(自动处理压缩)
oSession.utilDecodeResponse(); // 自动解压
var responseBody = oSession.GetResponseBodyAsString();
```

---

## 进阶配置

### 自动保存历史记录

修改脚本,保存带时间戳的文件:

```javascript
// 生成带时间戳的文件名
var now = new Date();
var timestamp = now.getFullYear() +
                padZero(now.getMonth() + 1) +
                padZero(now.getDate()) + "_" +
                padZero(now.getHours()) +
                padZero(now.getMinutes()) +
                padZero(now.getSeconds());

var historyPath = "E:\\美团外卖数据\\history\\poi_" + timestamp + ".json";

// 保存历史文件
var historyFile = fso.CreateTextFile(historyPath, true, false);
historyFile.Write(responseBody);
historyFile.Close();

// 辅助函数: 补零
function padZero(num) {
    return num < 10 ? "0" + num : num;
}
```

### 过滤特定店铺

只保存特定条件的店铺数据:

```javascript
// 解析 JSON (需要 JSON 库支持)
var jsonObj = JSON.parse(responseBody);
var storeName = jsonObj.data.poi_info.name;

// 只保存包含关键词的店铺
if (storeName.indexOf("海底捞") > -1 ||
    storeName.indexOf("肯德基") > -1) {
    // 保存文件
    // ...
}
```

### 自动清理旧文件

在脚本中添加文件清理逻辑:

```javascript
// 删除超过 7 天的旧文件
var folder = fso.GetFolder("E:\\美团外卖数据\\history");
var files = new Enumerator(folder.Files);
var sevenDaysAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);

for (; !files.atEnd(); files.moveNext()) {
    var file = files.item();
    if (file.DateLastModified.getTime() < sevenDaysAgo) {
        file.Delete();
    }
}
```

---

## 使用建议

### 📌 最佳实践

1. **保持 Fiddler 运行**
   - 在需要抓取数据期间,保持 Fiddler 运行
   - 最小化到系统托盘以节省资源

2. **定期清理日志**
   - Fiddler 会保存所有请求,长时间运行会占用大量内存
   - 定期点击 `Remove All` 清理已捕获的请求

3. **备份脚本配置**
   - 保存自定义的 FiddlerScript 到单独文件
   - 避免 Fiddler 更新后丢失配置

4. **使用 Filters 减少噪音**
   - Fiddler → `Filters` → `Use Filters`
   - Hosts: `Show only: wmapi.meituan.com`
   - 这样只显示美团相关的请求

### ⚠️ 注意事项

1. **数据隐私**
   - Fiddler 会捕获所有 HTTPS 流量,包括敏感信息
   - 使用完毕后,建议在手机上删除代理配置和证书

2. **网络性能**
   - 代理会略微降低网络速度
   - 不需要抓包时,关闭手机代理设置

3. **证书安全**
   - Fiddler 证书是自签名证书,可能降低安全性
   - 不要在生产环境或重要账号上长期使用

4. **合法合规**
   - 仅用于学习和个人研究目的
   - 不得用于商业用途或侵犯他人权益

---

## 故障排除流程图

```
开始
  ↓
Fiddler 是否运行? → 否 → 启动 Fiddler
  ↓ 是
手机能否访问百度? → 否 → 检查代理配置
  ↓ 是
Fiddler 能否捕获流量? → 否 → 检查防火墙/证书
  ↓ 是
打开美团 APP 浏览店铺
  ↓
Fiddler Log 显示保存成功? → 是 → 成功!
  ↓ 否
检查 URL 是否匹配
  ↓
检查脚本语法
  ↓
检查文件路径权限
```

---

## 参考资源

### 官方文档
- **Fiddler 官网**: https://www.telerik.com/fiddler
- **FiddlerScript 文档**: https://docs.telerik.com/fiddler/extend-fiddler/addscript

### 社区资源
- **Fiddler 论坛**: https://www.telerik.com/forums/fiddler
- **Stack Overflow Fiddler 标签**: https://stackoverflow.com/questions/tagged/fiddler

### 相关工具
- **Charles Proxy** (macOS 替代方案)
- **mitmproxy** (命令行工具)
- **Wireshark** (底层网络分析)

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0 | 2024-01 | 初始版本,基础配置说明 |
| v2.0 | 2024-10 | 完善脚本代码,添加进阶配置 |

---

## 技术支持

如果在配置过程中遇到问题:

1. **查看本文档的"常见问题"章节**
2. **检查 Fiddler Log 标签的错误信息**
3. **提交 GitHub Issue** (附带错误截图和日志)

---

<div align="center">

**📚 相关文档**

[README.md](README.md) • [CLAUDE.md](CLAUDE.md) • [使用说明.md](使用说明.md)

---

**⚡ 快速链接**

[项目仓库](https://github.com/XUXIKAI886/touxiangdianzhaohaibaotiqu) • [在线演示](https://xuxikai886.github.io/touxiangdianzhaohaibaotiqu)

</div>
