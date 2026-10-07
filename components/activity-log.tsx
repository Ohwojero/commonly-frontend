'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ActivityLog() { const [items, setItems] = useState<any[]>([]); useEffect(() => { fetch('/api/activity').then((res) => res.json()).then(setItems).catch(() => setItems([])) }, []); return <Card className="mt-6"><CardHeader><CardTitle>Activity log</CardTitle></CardHeader><CardContent><div className="divide-y">{items.length ? items.map((item) => <div key={item.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{item.eventName}</p><p className="text-muted-foreground">{item.email || 'Guest'}{item.location ? ` · ${item.location}` : ''}{item.productSlug ? ` · ${item.productSlug}` : ''}</p></div><time className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</time></div>) : <p className="text-sm text-muted-foreground">No activity recorded yet.</p>}</div></CardContent></Card> }
