# Corsi Block-Tapping Test

## 概要

このプロジェクトは、ワーキングメモリ（視空間スパン）を測定するCorsi Block-Tapping TestのWeb実装版です。参加者は画面に表示されたブロックが光る順序を記憶し、同じ順序で再現することが求められます。

## Corsi Block-Tapping Test

Corsi Block-Tapping Testは、1972年にPhilip Michael Corsiによって開発された、視空間的短期記憶容量（視空間スパン）を測定するテストです。

### 主な用途
- 視空間的ワーキングメモリの評価
- 認知機能の研究
- 教育心理学研究

## 機能

- **適応的難易度調整**: 2ブロックから開始し、正解すると自動的に難易度が上昇
- **自動進行**: 必要数のブロックを選択すると自動的に次へ進行
- **詳細なデータ記録**: 各試行の詳細情報と回答時間をミリ秒単位で記録
- **CSV出力**: 実験データをCSV形式でダウンロード可能

## セットアップと使用方法

### 必要な環境
- Webブラウザ（Chrome、Firefox、Safari、Edge等）
- JavaScriptが有効になっていること

### インストール
1. すべてのファイルを同じディレクトリに配置
2. `index.html`をWebブラウザで開く

### 使用手順
1. 参加者名またはIDを入力
2. 「はじめる」ボタンをクリック
3. 説明を読み、スペースキーを押して開始
4. 黄色く光ったブロックの順序を記憶
5. 「開始！」の合図後、同じ順序でブロックをクリック
6. 2回連続で間違えるか、9ブロック成功で終了
7. 結果をCSV形式でダウンロード

## ファイル構成

```
corsi-block-test/
│
├── index.html # メインHTMLファイル
├── script.js  # ゲームロジックとデータ処理
└── README.md  # このファイル
```

### index.html
- UIの基本構造
- スタイルシート（内部CSS）
- 参加者情報入力フォーム

### script.js
- ゲームロジックの実装
- データ記録と管理
- CSV出力機能
- タイミング制御

## 出力データ（CSV）

出力されるCSVファイルには以下の情報が含まれます：

| フィールド名 | 説明 | 例 |
|------------|------|-----|
| participant | 参加者名/ID | "Participant_01" |
| datetime | 実験開始日時 | "2025-08-01_12:30:00" |
| trial | 試行番号 | 1, 2, 3... |
| blockCount | 提示ブロック数 | 2, 3, 4... |
| presentedSeq | 提示順序（1-9） | "3-7-2" |
| responseSeq | 回答順序（1-9） | "3-7-2" |
| correct | 正誤（1=正解、0=不正解） | 1 |
| responseTime | 回答時間（ミリ秒） | 3250 |

### ファイル名形式
`corsi_results_[参加者名]_[開始日時].csv`

## 実験パラメータ

### デフォルト設定
- **開始ブロック数**: 2
- **最大ブロック数**: 9
- **終了条件**: 2回連続エラーまたは9ブロック成功
- **ブロック表示時間**: 750ms
- **ブロック間隔**: 300ms
- **カウントダウン**: 3秒

### タイミング設定（script.js内で調整可能）
```javascript
await sleep(750);  // ブロック表示時間
await sleep(300);  // ブロック間の待機時間
await sleep(600);  // 初期待機時間
```

## Corsiスパンの算出

Corsiスパンは、参加者が正確に再現できる最長のブロック数として定義されます。本実装では、最後に成功した試行のブロック数をCorsiスパンとして記録します。

## カスタマイズ

### 視覚的カスタマイズ
`index.html`内のCSSセクションで以下の要素を調整可能：
- ブロックの色（`.blockbtn`のbackground）
- ハイライト色（`.highlight`のbackground）
- 選択済み色（`.selected`のbackground）
- ブロックサイズ（grid-template-columnsの値）

### 実験パラメータの変更
`script.js`内の以下の変数を調整：
```javascript
let maxBlockCount = 2;     // 開始ブロック数
// 終了条件はfinishTrial関数内で調整
```

## ブラウザ互換性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 注意事項

- 実験実施時は、画面の明るさや環境を一定に保つことを推奨
- タッチデバイスでも動作しますが、マウス使用を推奨
- ブラウザの戻るボタンを押すとデータが失われます

## トラブルシューティング

### よくある問題と解決方法

**Q: CSVファイルがダウンロードされない**
A: ブラウザのポップアップブロッカーを無効にしてください

**Q: ブロックが反応しない**
A: JavaScriptが有効になっているか確認してください

**Q: 文字化けする**
A: CSVファイルをExcelで開く際は、UTF-8エンコーディングを指定してください

## ライセンス

このプロジェクトは教育・研究目的で自由に使用できます。商用利用の際はご相談ください。

## 参考文献

- Corsi, P. M. (1972). Human memory and the medial temporal region of the brain. *Dissertation Abstracts International*, 34, 891B.
- Kessels, R. P., van Zandvoort, M. J., Postma, A., Kappelle, L. J., & de Haan, E. H. (2000). The Corsi Block-Tapping Task: standardization and normative data. *Applied Neuropsychology*, 7(4), 252-258.

## 連絡先

質問や要望がある場合は、メール(komuro.4121(at)gmail.com)へご連絡ください。
