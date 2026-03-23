# React 状態管理パターン比較 — フラグ地獄 vs 有限状態機械

Zenn記事「[Reactのフラグ地獄をStateパターンで倒す — 有限状態機械×テーブル駆動設計の実践](https://zenn.dev/)」の実装サンプルです。

同じバックエンドAPIからユーザー一覧を取得する2つのReactアプリで、
**Badパターン（フラグ管理）** と **Goodパターン（テーブル駆動FSM）**
の違いを体験できます。

## ディレクトリ構成

```text
react-state-pattern-comparison/
├── backend/        # 共有APIサーバー（json-server、固定User[]を返す）
├── flag-pattern/   # ❌ Badパターン: boolean フラグ × 5個で状態管理
└── fsm-pattern/    # ✅ Goodパターン: Discriminated Union + テーブル駆動FSM
```

## 技術スタック

全プロジェクト共通: **Vite + TypeScript + Vitest + ESLint + Prettier**

| プロジェクト | 役割 | テスト数 |
| --- | --- | --- |
| backend | `GET /users` を提供（port 3001） | 5 |
| flag-pattern | 独立したbooleanフラグで非同期状態を管理 | 7 |
| fsm-pattern | 遷移テーブルで状態管理、`availableEvents` 自動導出 | 20 |

## セットアップ

```bash
# 各ディレクトリで依存をインストール
cd backend && npm install && cd ..
cd flag-pattern && npm install && cd ..
cd fsm-pattern && npm install && cd ..
```

## 起動方法

3つのターミナルで実行してください。

```bash
# ターミナル1: バックエンドAPI（port 3001）
cd backend && npm start

# ターミナル2: Badパターン（port 5173）
cd flag-pattern && npm run dev

# ターミナル3: Goodパターン（port 5174）
cd fsm-pattern && npm run dev -- --port 5174
```

## 検証コマンド

各ディレクトリで以下がすべてPassします。

```bash
npm run format:check   # Prettier
npm run lint           # ESLint
npm run test           # Vitest
npm run build          # TypeScript + Vite build
```

## パターン比較

### ❌ flag-pattern（Badパターン）

```tsx
// 5個のbooleanフラグ → 2^5 = 32通りの組み合わせ（有効なのは4通りだけ）
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [hasData, setHasData] = useState(false);
```

- 不正な状態の組み合わせ（`isLoading && isError`）を防げない
- 条件分岐の優先順位に依存した脆いレンダリング
- デバッグ表示で現在のフラグ値を確認可能

### ✅ fsm-pattern（Goodパターン）

```tsx
// 状態は常に1つ → 不正な組み合わせはゼロ
type AsyncState = IdleState | LoadingState | SuccessState | ErrorState;
```

- 遷移テーブルがマトリクスと1対1対応
- `availableEvents` がテーブルから自動導出 → UIボタンと状態機械が常に同期
- 無効な遷移は自動的に無視される
