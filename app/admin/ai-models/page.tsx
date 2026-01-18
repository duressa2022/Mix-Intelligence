'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Brain, Cpu, Database, Settings, Zap, History } from 'lucide-react';

const mockPerformanceData = [
    { name: 'Week 1', accuracy: 82, latency: 120 },
    { name: 'Week 2', accuracy: 85, latency: 115 },
    { name: 'Week 3', accuracy: 84, latency: 125 },
    { name: 'Week 4', accuracy: 88, latency: 110 },
    { name: 'Week 5', accuracy: 91, latency: 105 },
];

const mockModelMetrics = [
    { subject: 'Precision', A: 120, B: 110, fullMark: 150 },
    { subject: 'Recall', A: 98, B: 130, fullMark: 150 },
    { subject: 'F1-Score', A: 86, B: 130, fullMark: 150 },
    { subject: 'Latency', A: 99, B: 100, fullMark: 150 },
    { subject: 'Drift', A: 85, B: 90, fullMark: 150 },
];

export default function AIModelsPage() {
    const [isTraining, setIsTraining] = useState(false);

    const startReTraining = () => {
        setIsTraining(true);
        setTimeout(() => setIsTraining(false), 3000);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Intelligence Layer</h1>
                    <p className="text-muted-foreground">Manage and monitor machine learning models for drought forecasting.</p>
                </div>
                <Button onClick={startReTraining} disabled={isTraining} className="w-full md:w-auto">
                    {isTraining ? <Zap className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                    {isTraining ? 'Training in Progress...' : 'Re-train All Models'}
                </Button>
            </div>

            <Tabs defaultValue="models" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="models">Active Models</TabsTrigger>
                    <TabsTrigger value="performance">Performance Labs</TabsTrigger>
                    <TabsTrigger value="training">Training Center</TabsTrigger>
                </TabsList>

                <TabsContent value="models" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            { name: 'LSTM_SHORT_TERM', type: 'Recurrent Neural Net', status: 'Optimal', acc: '91.2%', latency: '45ms', icon: <Cpu className="text-blue-500" /> },
                            { name: 'XGBOOST_SEASONAL', type: 'Gradient Boosting', status: 'Stable', acc: '87.5%', latency: '12ms', icon: <Zap className="text-orange-500" /> },
                            { name: 'RF_RISK_CLASSIFIER', type: 'Random Forest', status: 'Degrading', acc: '76.4%', latency: '8ms', icon: <Database className="text-red-500" /> }
                        ].map((model) => (
                            <Card key={model.name}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                                    {model.icon}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl font-bold">{model.acc} Accuracy</div>
                                    <div className="text-xs text-muted-foreground mt-1">{model.type}</div>
                                    <div className="flex justify-between mt-4">
                                        <Badge variant={model.status === 'Optimal' ? 'default' : model.status === 'Stable' ? 'secondary' : 'destructive'}>
                                            {model.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{model.latency}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Spatiotemporal Model Visualization</CardTitle>
                            <CardDescription>Deep learning feature importance and node activation map.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 border rounded-md">
                            <div className="text-center space-y-2">
                                <History className="h-12 w-12 mx-auto text-slate-300" />
                                <p className="text-slate-500">Feature importance map loading...</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inference Accuracy Trend</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockPerformanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Model Robustness Matrix</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockModelMetrics}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis />
                                        <Radar name="LSTM" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
                                        <Radar name="XGBoost" dataKey="B" stroke="#ea580c" fill="#f97316" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="training" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Training Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Hyperparameter Suite</label>
                                    <div className="p-3 bg-slate-100 rounded border font-mono text-xs">
                                        learning_rate: 0.001, epochs: 150,<br />
                                        optimizer: "adam", loss: "mse"
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Auto-scaling Policy</label>
                                    <div className="p-3 bg-slate-100 rounded border font-mono text-xs">
                                        scale_on: "drift_detected", <br />
                                        min_nodes: 2, max_nodes: 8
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">
                                <Settings className="mr-2 h-4 w-4" /> Open Advanced ML Config
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
