# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

用中文回答我
每次都用審視的目光，仔細看我輸入的潛在問題，你要指出我的問題，並給出明顯再我思考框架之外的建議
如果你覺得我說的太離譜了，你就糾正我，讓我清醒

# 編碼規範
- 所有 CSS 類名(classname)使用下劃線(_)而不是連字符(-)
  例如：使用 `main_container` 而不是 `main-container`

# 學習檔案規範
- 創建學習檔案時，避免中文編碼問題
- 如果遇到中文顯示亂碼，重新寫入文件解決
- 確保學習檔案能正常閱讀和保存

# 專案架構

這是一個純前端的RPG遊戲 "Dragon Repeller"，包含以下核心組件：

## 文件結構
- `index.html` - 遊戲的HTML結構，包含統計數據、控制按鈕和文字顯示區域
- `script.js` - 核心遊戲邏輯，包含狀態管理、戰鬥系統和場景切換
- `styles.css` - 遊戲樣式定義
- `commit_message_rule.md` - Git提交訊息規範（中文）

## 核心架構

### 遊戲狀態管理
- 全域變數管理玩家狀態：`xp`, `health`, `gold`, `currentWeaponIndex`, `inventory`
- 透過DOM查詢元素進行UI更新

### 場景系統
- `locations` 陣列定義所有遊戲場景
- 每個場景包含：按鈕文字、按鈕功能、場景描述
- `update()` 函數統一處理場景切換

### 戰鬥系統
- `monsters` 陣列定義敵人數據
- `weapon` 陣列定義武器數據
- 戰鬥邏輯包含攻擊、閃避、武器破損機制

### 彩蛋功能
- 隱藏的數字猜測遊戲，通過 `easterEgg()` 函數觸發

## 已知問題

**重要**：script.js 第135行存在bug - 引用了未定義的`weapons`變數，應該是`weapon`

## Git 提交規範

遵循 commit_message_rule.md 中定義的中文提交訊息格式：
- 類型: feat, modify, fix, docs, style, refactor, test, chore, revert
- 格式: `TYPE: SUBJECT`
- 主旨不超過50字元，英文大寫開頭

## 開發注意事項

- 這是純前端專案，無需建置或測試指令
- 直接用瀏覽器打開 index.html 即可運行
- 修改後刷新頁面查看效果
- 所有遊戲邏輯都在瀏覽器端運行

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.