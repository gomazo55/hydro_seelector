"use client";

import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  ReferenceArea
} from "recharts";

// 水車データの定義（グラフ描画用に範囲データを持つ）
const TURBINE_DATA = [
  { name: "ペルトン", x1: 0.1, x2: 10, y1: 50, y2: 1000, color: "#3b82f6" },
  { name: "フランシス", x1: 0.5, x2: 50, y1: 20, y2: 400, color: "#10b981" },
  { name: "カプラン", x1: 2.0, x2: 200, y1: 2, y2: 40, color: "#f59e0b" },
  { name: "クロスフロー", x1: 0.1, x2: 5, y1: 5, y2: 100, color: "#8b5cf6" },
];

export default function HydroChartPage() {
  const [head, setHead] = useState(30);
  const [flow, setFlow] = useState(1.5);

  // ユーザーの現在地プロットデータ
  const userData = [{ x: flow, y: head }];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">水車選定図 (Log Scale)</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 入力パネル */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold mb-4">選定パラメータ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm">使用流量 Q (m³/s)</label>
              <input 
                type="number" value={flow} onChange={(e) => setFlow(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">有効落差 H (m)</label>
              <input 
                type="number" value={head} onChange={(e) => setHead(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* グラフパネル */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              
              {/* X軸: 流量 (対数スケール) */}
              <XAxis 
                type="number" dataKey="x" name="流量" scale="log" domain={[0.1, 500]} 
                allowDataOverflow={true} unit="m³/s"
              >
                <Label value="流量 Q (m³/s)" offset={-20} position="insideBottom" />
              </XAxis>

              {/* Y軸: 落差 (対数スケール) */}
              <YAxis 
                type="number" dataKey="y" name="落差" scale="log" domain={[1, 1000]} 
                allowDataOverflow={true} unit="m"
              >
                <Label value="落差 H (m)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>

              <ZAxis type="number" range={[100, 100]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />

              {/* 背景の選定エリア描画 */}
              {TURBINE_DATA.map((t) => (
                <ReferenceArea
                  key={t.name}
                  x1={t.x1} x2={t.x2} y1={t.y1} y2={t.y2}
                  fill={t.color} fillOpacity={0.15} stroke={t.color} strokeWidth={1}
                />
              ))}

              {/* ユーザーの入力点 */}
              <Scatter name="選定点" data={userData} fill="#ef4444" shape="cross" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-500 italic">
        ※赤い十字マークが現在の入力条件です。色付きのエリアは各水車の一般的な適用範囲を示します。
      </p>
    </div>
  );
}
