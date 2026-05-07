"use client";

import * as React from "react";
import {
  PecoAlert,
  PecoBadge,
  PecoButton,
  PecoCard,
  PecoEmptyState,
  PecoHeader,
  PecoInput,
  PecoLayout,
  PecoLogo,
  PecoModal,
  PecoSelect,
  PecoSpinner,
  PecoTable,
  type PecoTableColumn,
  type PecoTableSort,
  useToast,
} from "@/components/peco";

interface ColorSwatch {
  name: string;
  cssVar: string;
  hex: string;
}

const primaryPalette: ColorSwatch[] = [
  { name: "primary", cssVar: "--peco-primary", hex: "#00B5AD" },
  { name: "primary-dark", cssVar: "--peco-primary-dark", hex: "#009490" },
  { name: "primary-light", cssVar: "--peco-primary-light", hex: "#E0F7F6" },
  { name: "primary-subtle", cssVar: "--peco-primary-subtle", hex: "#F0FAFA" },
];

const semanticPalette: ColorSwatch[] = [
  { name: "success", cssVar: "--peco-success", hex: "#27AE60" },
  { name: "warning", cssVar: "--peco-warning", hex: "#F39C12" },
  { name: "danger", cssVar: "--peco-danger", hex: "#E74C3C" },
  { name: "info", cssVar: "--peco-info", hex: "#2980B9" },
];

const triagePalette: ColorSwatch[] = [
  { name: "triage-green", cssVar: "--peco-triage-green", hex: "#27AE60" },
  { name: "triage-yellow", cssVar: "--peco-triage-yellow", hex: "#F39C12" },
  { name: "triage-red", cssVar: "--peco-triage-red", hex: "#E74C3C" },
];

const grayPalette: ColorSwatch[] = [
  { name: "gray-900", cssVar: "--peco-gray-900", hex: "#1A1A2E" },
  { name: "gray-700", cssVar: "--peco-gray-700", hex: "#374151" },
  { name: "gray-500", cssVar: "--peco-gray-500", hex: "#6B7280" },
  { name: "gray-300", cssVar: "--peco-gray-300", hex: "#D1D5DB" },
  { name: "gray-100", cssVar: "--peco-gray-100", hex: "#F3F4F6" },
  { name: "gray-50", cssVar: "--peco-gray-50", hex: "#F9FAFB" },
];

interface SamplePatient {
  id: string;
  name: string;
  species: string;
  visit: string;
  status: "受付済" | "診察中" | "完了";
  triage: "green" | "yellow" | "red";
}

const samplePatients: SamplePatient[] = [
  { id: "P-0001", name: "ココ", species: "犬・トイプードル", visit: "2026-05-08 09:30", status: "診察中", triage: "yellow" },
  { id: "P-0002", name: "ミケ", species: "猫・三毛", visit: "2026-05-08 10:00", status: "受付済", triage: "green" },
  { id: "P-0003", name: "レオ", species: "犬・ゴールデン", visit: "2026-05-08 10:15", status: "完了", triage: "green" },
  { id: "P-0004", name: "サクラ", species: "猫・スコティッシュ", visit: "2026-05-08 11:00", status: "受付済", triage: "red" },
];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-peco-gray-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-peco-gray-500">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Swatch({ swatch }: { swatch: ColorSwatch }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-12 w-12 shrink-0 rounded-peco-md border border-peco-gray-100 shadow-peco-sm"
        style={{ backgroundColor: `var(${swatch.cssVar})` }}
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-peco-gray-900">{swatch.name}</p>
        <p className="text-xs text-peco-gray-500 font-mono">{swatch.hex}</p>
        <p className="text-xs text-peco-gray-500 font-mono">{swatch.cssVar}</p>
      </div>
    </div>
  );
}

const triageVariant = {
  green: "success",
  yellow: "warning",
  red: "danger",
} as const;

export default function DesignCatalogPage() {
  const toast = useToast();

  const [inputValue, setInputValue] = React.useState("");
  const [selectValue, setSelectValue] = React.useState("");
  const [errorInput, setErrorInput] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(true);
  const [showEmpty, setShowEmpty] = React.useState(false);
  const [sort, setSort] = React.useState<PecoTableSort | null>({
    key: "visit",
    direction: "asc",
  });

  const sorted = React.useMemo(() => {
    if (!sort) return samplePatients;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...samplePatients].sort((a, b) => {
      const av = String(a[sort.key as keyof SamplePatient] ?? "");
      const bv = String(b[sort.key as keyof SamplePatient] ?? "");
      return av.localeCompare(bv, "ja") * dir;
    });
  }, [sort]);

  const tableData = showEmpty ? [] : sorted;

  const columns: PecoTableColumn<SamplePatient>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      width: "100px",
      accessor: (r) => <span className="font-mono text-peco-gray-700">{r.id}</span>,
    },
    {
      key: "name",
      header: "ペット名",
      sortable: true,
      accessor: (r) => <span className="font-semibold">{r.name}</span>,
    },
    { key: "species", header: "種別", accessor: (r) => r.species },
    {
      key: "visit",
      header: "来院日時",
      sortable: true,
      accessor: (r) => <span className="font-mono text-sm">{r.visit}</span>,
    },
    {
      key: "triage",
      header: "トリアージ",
      align: "center",
      accessor: (r) => (
        <PecoBadge variant={triageVariant[r.triage]} dot>
          {r.triage.toUpperCase()}
        </PecoBadge>
      ),
    },
    {
      key: "status",
      header: "ステータス",
      accessor: (r) => (
        <PecoBadge
          variant={
            r.status === "完了"
              ? "success"
              : r.status === "診察中"
                ? "info"
                : "neutral"
          }
        >
          {r.status}
        </PecoBadge>
      ),
    },
  ];

  return (
    <PecoLayout
      header={{
        nav: [
          { label: "ダッシュボード", href: "#header", active: true },
          { label: "カラー", href: "#colors" },
          { label: "コンポーネント", href: "#buttons" },
          { label: "テーブル", href: "#table" },
        ],
        alertCount: 3,
        userName: "石井 剛",
        logoSubtitle: "Design System",
      }}
    >
      <div className="space-y-12">
        {/* Intro */}
        <header className="flex flex-col gap-2">
          <PecoBadge variant="info" size="md">
            v0.1 — Design System
          </PecoBadge>
          <h1 className="text-3xl font-bold text-peco-gray-900">
            PECO Smart Pet Medical デザインカタログ
          </h1>
          <p className="text-peco-gray-500">
            SFA・診断支援・PecoStock の3システムで共通利用するコンポーネントとデザイントークン。
            iPad（768px）最適化・PECOブランドカラー（#00B5AD）統一。
          </p>
        </header>

        {/* Colors */}
        <Section
          id="colors"
          title="カラーパレット"
          description="ブランド・セマンティック・トリアージ・ニュートラルの4系統"
        >
          <PecoCard title="Primary（ブランド）">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {primaryPalette.map((s) => (
                <Swatch key={s.cssVar} swatch={s} />
              ))}
            </div>
          </PecoCard>
          <PecoCard title="Semantic">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {semanticPalette.map((s) => (
                <Swatch key={s.cssVar} swatch={s} />
              ))}
            </div>
          </PecoCard>
          <PecoCard title="Triage（トリアージ）">
            <div className="grid grid-cols-3 gap-4">
              {triagePalette.map((s) => (
                <Swatch key={s.cssVar} swatch={s} />
              ))}
            </div>
          </PecoCard>
          <PecoCard title="Neutral">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {grayPalette.map((s) => (
                <Swatch key={s.cssVar} swatch={s} />
              ))}
            </div>
          </PecoCard>
        </Section>

        {/* Typography */}
        <Section id="typography" title="タイポグラフィ" description="Noto Sans JP / Inter">
          <PecoCard>
            <div className="space-y-3">
              <div className="text-2xl">2xl・24px — 主要見出し</div>
              <div className="text-xl">xl・20px — セクション見出し</div>
              <div className="text-lg">lg・18px — サブ見出し</div>
              <div className="text-base">base・16px — 本文（iPad 推奨）</div>
              <div className="text-sm">sm・14px — 補足</div>
              <div className="text-xs">xs・12px — キャプション</div>
            </div>
          </PecoCard>
        </Section>

        {/* Logo */}
        <Section id="logo" title="ロゴ" description="後でSVGロゴに差替予定">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PecoCard title="白背景（primary）">
              <div className="flex items-center gap-8 bg-white py-6">
                <PecoLogo size="sm" color="primary" />
                <PecoLogo size="md" color="primary" />
                <PecoLogo size="lg" color="primary" />
              </div>
            </PecoCard>
            <PecoCard title="ティール背景（white）" noPadding>
              <div className="flex items-center gap-8 px-5 py-6 bg-peco-primary rounded-b-peco-lg">
                <PecoLogo size="sm" color="white" />
                <PecoLogo size="md" color="white" />
                <PecoLogo size="lg" color="white" />
              </div>
            </PecoCard>
          </div>
        </Section>

        {/* Header */}
        <Section id="header" title="ヘッダー" description="ロゴ + ナビ + アラート + ユーザー">
          <div className="overflow-hidden rounded-peco-lg shadow-peco-md">
            <PecoHeader
              nav={[
                { label: "案件", href: "#", active: true },
                { label: "病院", href: "#" },
                { label: "レポート", href: "#" },
                { label: "設定", href: "#" },
              ]}
              alertCount={5}
              userName="石井 剛"
              logoSubtitle="SFA"
            />
            <div className="bg-white p-6 text-sm text-peco-gray-500">
              実際の利用時は <code className="font-mono">PecoLayout</code> 経由で表示されます。
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section id="buttons" title="ボタン" description="primary / secondary / danger / ghost × sm / md / lg">
          <PecoCard>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <PecoButton variant="primary">主要アクション</PecoButton>
                <PecoButton variant="secondary">サブアクション</PecoButton>
                <PecoButton variant="danger">削除</PecoButton>
                <PecoButton variant="ghost">キャンセル</PecoButton>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <PecoButton size="sm">Small</PecoButton>
                <PecoButton size="md">Medium</PecoButton>
                <PecoButton size="lg">Large</PecoButton>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <PecoButton isLoading>送信中</PecoButton>
                <PecoButton disabled>無効</PecoButton>
                <PecoButton
                  variant="secondary"
                  leftIcon={
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  }
                >
                  追加
                </PecoButton>
              </div>
            </div>
          </PecoCard>
        </Section>

        {/* Cards */}
        <Section id="cards" title="カード">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PecoCard title="基本カード" subtitle="title + subtitle + content">
              <p className="text-sm text-peco-gray-700">
                カード内のコンテンツ領域。padding は 20px。
              </p>
            </PecoCard>
            <PecoCard
              title="フッター付き"
              subtitle="footer エリア"
              footer={
                <div className="flex justify-end gap-2">
                  <PecoButton size="sm" variant="ghost">キャンセル</PecoButton>
                  <PecoButton size="sm">保存</PecoButton>
                </div>
              }
            >
              <p className="text-sm text-peco-gray-700">フォームの送信などに利用。</p>
            </PecoCard>
            <PecoCard title="ホバー可能" subtitle="hoverable + bordered" hoverable bordered>
              <p className="text-sm text-peco-gray-700">
                クリックできるカードに。
              </p>
            </PecoCard>
          </div>
        </Section>

        {/* Inputs / Select */}
        <Section id="forms" title="フォーム入力" description="Input・Select（48px・iPad最適化）">
          <PecoCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PecoInput
                label="ペット名"
                placeholder="例：ココ"
                helpText="任意の表示名"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
              <PecoInput
                label="メールアドレス"
                type="email"
                placeholder="user@peco.co.jp"
                error={errorInput.length > 0 && !errorInput.includes("@") ? "正しいメール形式を入力してください" : undefined}
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
              />
              <PecoInput label="生年月日" type="date" />
              <PecoInput label="数量" type="number" min={0} placeholder="0" helpText="マイナス不可" />
              <PecoSelect
                label="動物病院"
                placeholder="病院を選択"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: "h1", label: "PECO動物病院 渋谷" },
                  { value: "h2", label: "PECO動物病院 新宿" },
                  { value: "h3", label: "PECO動物病院 横浜" },
                ]}
                required
              />
              <PecoSelect
                label="トリアージ"
                error="必須項目です"
                options={[
                  { value: "green", label: "Green（軽症）" },
                  { value: "yellow", label: "Yellow（中等症）" },
                  { value: "red", label: "Red（重症）" },
                ]}
              />
            </div>
          </PecoCard>
        </Section>

        {/* Badges */}
        <Section id="badges" title="バッジ">
          <PecoCard>
            <div className="flex flex-wrap items-center gap-2">
              <PecoBadge variant="success">完了</PecoBadge>
              <PecoBadge variant="warning">警告</PecoBadge>
              <PecoBadge variant="danger">緊急</PecoBadge>
              <PecoBadge variant="info">情報</PecoBadge>
              <PecoBadge variant="neutral">下書き</PecoBadge>
              <PecoBadge variant="success" dot>稼働中</PecoBadge>
              <PecoBadge variant="danger" dot>停止中</PecoBadge>
              <PecoBadge variant="info" size="md">サイズ md</PecoBadge>
            </div>
          </PecoCard>
        </Section>

        {/* Alerts */}
        <Section id="alerts" title="アラート">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PecoAlert variant="success" title="保存しました">
              変更内容はすべて保存されました。
            </PecoAlert>
            <PecoAlert variant="warning" title="在庫が少なくなっています">
              ワクチン在庫が残り 5 本です。
            </PecoAlert>
            <PecoAlert variant="danger" title="同期に失敗しました" onClose={() => undefined}>
              ネットワーク接続を確認してください。
            </PecoAlert>
            {alertVisible ? (
              <PecoAlert
                variant="info"
                title="新機能のお知らせ"
                onClose={() => setAlertVisible(false)}
              >
                トリアージ自動判定機能が公開されました。
              </PecoAlert>
            ) : (
              <PecoButton variant="secondary" onClick={() => setAlertVisible(true)}>
                infoアラートを再表示
              </PecoButton>
            )}
          </div>
        </Section>

        {/* Spinner */}
        <Section id="spinner" title="スピナー">
          <PecoCard>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <PecoSpinner size="sm" />
                <span className="text-xs text-peco-gray-500">sm / primary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <PecoSpinner size="md" />
                <span className="text-xs text-peco-gray-500">md / primary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <PecoSpinner size="lg" />
                <span className="text-xs text-peco-gray-500">lg / primary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <PecoSpinner size="lg" color="gray" />
                <span className="text-xs text-peco-gray-500">lg / gray</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-peco-md bg-peco-primary p-4">
                <PecoSpinner size="lg" color="white" />
                <span className="text-xs text-white">lg / white</span>
              </div>
            </div>
          </PecoCard>
        </Section>

        {/* Empty state */}
        <Section id="empty" title="EmptyState">
          <PecoCard noPadding>
            <PecoEmptyState
              title="まだ予約はありません"
              subtitle="新しい予約を作成するとここに表示されます。"
              action={<PecoButton>予約を作成</PecoButton>}
            />
          </PecoCard>
        </Section>

        {/* Modal + Toast */}
        <Section id="modal" title="モーダル & トースト">
          <PecoCard>
            <div className="flex flex-wrap gap-3">
              <PecoButton onClick={() => setModalOpen(true)}>モーダルを開く</PecoButton>
              <PecoButton
                variant="secondary"
                onClick={() => toast.success("保存しました", "成功")}
              >
                Success トースト
              </PecoButton>
              <PecoButton
                variant="secondary"
                onClick={() => toast.error("通信に失敗しました", "エラー")}
              >
                Error トースト
              </PecoButton>
              <PecoButton
                variant="secondary"
                onClick={() => toast.warning("在庫が少なくなっています", "警告")}
              >
                Warning トースト
              </PecoButton>
              <PecoButton
                variant="secondary"
                onClick={() => toast.info("新機能が公開されました", "お知らせ")}
              >
                Info トースト
              </PecoButton>
            </div>
          </PecoCard>
          <PecoModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="予約を確定しますか？"
            description="この操作は取り消せません。"
            footer={
              <div className="flex justify-end gap-2">
                <PecoButton variant="ghost" onClick={() => setModalOpen(false)}>
                  キャンセル
                </PecoButton>
                <PecoButton
                  onClick={() => {
                    setModalOpen(false);
                    toast.success("予約を確定しました");
                  }}
                >
                  確定する
                </PecoButton>
              </div>
            }
          >
            <p className="text-sm text-peco-gray-700">
              ペット「ココ」の 2026-05-08 09:30 の予約を確定します。
              診察医・トリアージ区分は確定後にも変更できます。
            </p>
          </PecoModal>
        </Section>

        {/* Table */}
        <Section id="table" title="テーブル" description="ソート・空状態・行クリック対応">
          <div className="flex items-center gap-2">
            <PecoButton
              variant="secondary"
              size="sm"
              onClick={() => setShowEmpty((v) => !v)}
            >
              {showEmpty ? "データを表示" : "空状態を表示"}
            </PecoButton>
          </div>
          <PecoTable
            columns={columns}
            data={tableData}
            rowKey={(r) => r.id}
            striped
            sort={sort}
            onSortChange={setSort}
            onRowClick={(r) => toast.info(`${r.name} の詳細を開きます`)}
          />
        </Section>
      </div>
    </PecoLayout>
  );
}
