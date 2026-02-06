import { useState, useEffect, useMemo } from 'react';
import type { Busse, Wartungstypen, Wartungsplanung, Wartungsdurchfuehrung } from '@/types/app';
import { APP_IDS } from '@/types/app';
import { LivingAppsService, extractRecordId, createRecordUrl } from '@/services/livingAppsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  AlertCircle,
  Bus,
  Wrench,
  Calendar,
  Euro,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PauseCircle
} from 'lucide-react';

// Status colors
const STATUS_COLORS = {
  in_betrieb: 'hsl(152 60% 40%)',
  reserve: 'hsl(220 65% 45%)',
  in_wartung: 'hsl(38 92% 50%)',
  ausser_betrieb: 'hsl(0 72% 51%)',
};

const STATUS_LABELS: Record<string, string> = {
  in_betrieb: 'In Betrieb',
  reserve: 'Reserve',
  in_wartung: 'In Wartung',
  ausser_betrieb: 'Außer Betrieb',
};

const PRIORITY_LABELS: Record<string, string> = {
  dringend: 'Dringend',
  hoch: 'Hoch',
  normal: 'Normal',
  niedrig: 'Niedrig',
};

const PLANNING_STATUS_LABELS: Record<string, string> = {
  geplant: 'Geplant',
  bestaetigt: 'Bestätigt',
  in_bearbeitung: 'In Bearbeitung',
  abgeschlossen: 'Abgeschlossen',
  verschoben: 'Verschoben',
};

// Number formatting for German locale
function formatNumber(value: number | null | undefined): string {
  if (value == null) return '-';
  return new Intl.NumberFormat('de-DE').format(value);
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '-';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    return format(parseISO(dateStr), 'dd.MM.yyyy', { locale: de });
  } catch {
    return dateStr;
  }
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

// Error state component
function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fehler beim Laden</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error.message}</p>
          <Button variant="outline" onClick={onRetry}>Erneut versuchen</Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md text-center p-8">
        <Bus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Keine Fahrzeuge vorhanden</h2>
        <p className="text-muted-foreground">Fügen Sie Fahrzeuge hinzu, um das Dashboard zu nutzen.</p>
      </Card>
    </div>
  );
}

// Priority badge component
function PriorityBadge({ priority }: { priority: string | undefined }) {
  if (!priority) return null;

  const colors: Record<string, string> = {
    dringend: 'bg-red-100 text-red-800 border-red-200',
    hoch: 'bg-orange-100 text-orange-800 border-orange-200',
    normal: 'bg-blue-100 text-blue-800 border-blue-200',
    niedrig: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <Badge variant="outline" className={colors[priority] || colors.normal}>
      {PRIORITY_LABELS[priority] || priority}
    </Badge>
  );
}

// Status badge component
function StatusBadge({ status }: { status: string | undefined }) {
  if (!status) return null;

  const colors: Record<string, string> = {
    geplant: 'bg-blue-100 text-blue-800',
    bestaetigt: 'bg-green-100 text-green-800',
    in_bearbeitung: 'bg-amber-100 text-amber-800',
    abgeschlossen: 'bg-gray-100 text-gray-800',
    verschoben: 'bg-red-100 text-red-800',
  };

  return (
    <Badge variant="secondary" className={colors[status] || ''}>
      {PLANNING_STATUS_LABELS[status] || status}
    </Badge>
  );
}

// Add maintenance dialog
function AddMaintenanceDialog({
  busse,
  wartungstypen,
  onSuccess
}: {
  busse: Busse[];
  wartungstypen: Wartungstypen[];
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bus: '',
    wartungstypen: '',
    durchfuehrungsdatum: format(new Date(), 'yyyy-MM-dd'),
    km_stand_bei_wartung: '',
    durchgefuehrte_arbeiten: '',
    gesamtkosten: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.bus || !formData.wartungstypen) return;

    setSubmitting(true);
    try {
      await LivingAppsService.createWartungsdurchfuehrungEntry({
        bus: createRecordUrl(APP_IDS.BUSSE, formData.bus),
        wartungstypen: createRecordUrl(APP_IDS.WARTUNGSTYPEN, formData.wartungstypen),
        durchfuehrungsdatum: formData.durchfuehrungsdatum,
        km_stand_bei_wartung: formData.km_stand_bei_wartung ? Number(formData.km_stand_bei_wartung) : undefined,
        durchgefuehrte_arbeiten: formData.durchgefuehrte_arbeiten || undefined,
        gesamtkosten: formData.gesamtkosten ? Number(formData.gesamtkosten) : undefined,
      });
      setOpen(false);
      setFormData({
        bus: '',
        wartungstypen: '',
        durchfuehrungsdatum: format(new Date(), 'yyyy-MM-dd'),
        km_stand_bei_wartung: '',
        durchgefuehrte_arbeiten: '',
        gesamtkosten: '',
      });
      onSuccess();
    } catch (err) {
      console.error('Failed to create maintenance record:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Wartung erfassen</span>
          <span className="sm:hidden">Erfassen</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Wartung erfassen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bus">Bus *</Label>
              <Select value={formData.bus} onValueChange={(v) => setFormData(prev => ({ ...prev, bus: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Bus wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {busse.map(bus => (
                    <SelectItem key={bus.record_id} value={bus.record_id}>
                      {bus.fields.fahrzeugnummer} - {bus.fields.kennzeichen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wartungstypen">Wartungstyp *</Label>
              <Select value={formData.wartungstypen} onValueChange={(v) => setFormData(prev => ({ ...prev, wartungstypen: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Typ wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {wartungstypen.map(wt => (
                    <SelectItem key={wt.record_id} value={wt.record_id}>
                      {wt.fields.bezeichnung}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="datum">Datum *</Label>
              <Input
                id="datum"
                type="date"
                value={formData.durchfuehrungsdatum}
                onChange={(e) => setFormData(prev => ({ ...prev, durchfuehrungsdatum: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="km">Kilometerstand</Label>
              <Input
                id="km"
                type="number"
                placeholder="z.B. 125000"
                value={formData.km_stand_bei_wartung}
                onChange={(e) => setFormData(prev => ({ ...prev, km_stand_bei_wartung: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arbeiten">Durchgeführte Arbeiten</Label>
            <Textarea
              id="arbeiten"
              placeholder="Beschreiben Sie die durchgeführten Arbeiten..."
              value={formData.durchgefuehrte_arbeiten}
              onChange={(e) => setFormData(prev => ({ ...prev, durchgefuehrte_arbeiten: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kosten">Gesamtkosten (EUR)</Label>
            <Input
              id="kosten"
              type="number"
              placeholder="z.B. 450"
              value={formData.gesamtkosten}
              onChange={(e) => setFormData(prev => ({ ...prev, gesamtkosten: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={submitting || !formData.bus || !formData.wartungstypen}>
              {submitting ? 'Speichern...' : 'Speichern'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Fleet status pill component
function FleetStatusPill({
  status,
  count,
  total
}: {
  status: string;
  count: number;
  total: number;
}) {
  const icons: Record<string, React.ReactNode> = {
    in_betrieb: <CheckCircle2 className="h-3.5 w-3.5" />,
    reserve: <PauseCircle className="h-3.5 w-3.5" />,
    in_wartung: <Wrench className="h-3.5 w-3.5" />,
    ausser_betrieb: <XCircle className="h-3.5 w-3.5" />,
  };

  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border-l-4 min-w-fit"
      style={{ borderLeftColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }}
    >
      <span style={{ color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }}>
        {icons[status]}
      </span>
      <span className="text-sm font-medium whitespace-nowrap">{STATUS_LABELS[status]}</span>
      <span className="text-lg font-bold">{count}</span>
      <span className="text-xs text-muted-foreground">({percentage}%)</span>
    </div>
  );
}

// Main Dashboard component
export default function Dashboard() {
  const [busse, setBusse] = useState<Busse[]>([]);
  const [wartungstypen, setWartungstypen] = useState<Wartungstypen[]>([]);
  const [wartungsplanung, setWartungsplanung] = useState<Wartungsplanung[]>([]);
  const [wartungsdurchfuehrung, setWartungsdurchfuehrung] = useState<Wartungsdurchfuehrung[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const [b, wt, wp, wd] = await Promise.all([
        LivingAppsService.getBusse(),
        LivingAppsService.getWartungstypen(),
        LivingAppsService.getWartungsplanung(),
        LivingAppsService.getWartungsdurchfuehrung(),
      ]);
      setBusse(b);
      setWartungstypen(wt);
      setWartungsplanung(wp);
      setWartungsdurchfuehrung(wd);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Create lookup maps
  const busseMap = useMemo(() => {
    const map = new Map<string, Busse>();
    busse.forEach(b => map.set(b.record_id, b));
    return map;
  }, [busse]);

  const wartungstypenMap = useMemo(() => {
    const map = new Map<string, Wartungstypen>();
    wartungstypen.forEach(wt => map.set(wt.record_id, wt));
    return map;
  }, [wartungstypen]);

  // Calculate fleet status counts
  const fleetStatus = useMemo(() => {
    const counts: Record<string, number> = {
      in_betrieb: 0,
      reserve: 0,
      in_wartung: 0,
      ausser_betrieb: 0,
    };
    busse.forEach(bus => {
      const status = bus.fields.status || 'in_betrieb';
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });
    return counts;
  }, [busse]);

  // Calculate attention count (in_wartung + ausser_betrieb)
  const attentionCount = fleetStatus.in_wartung + fleetStatus.ausser_betrieb;

  // Calculate monthly maintenance costs
  const currentMonthCosts = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return wartungsdurchfuehrung
      .filter(wd => {
        if (!wd.fields.durchfuehrungsdatum) return false;
        const date = parseISO(wd.fields.durchfuehrungsdatum);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, wd) => sum + (wd.fields.gesamtkosten || 0), 0);
  }, [wartungsdurchfuehrung]);

  // Calculate monthly costs for chart (last 6 months)
  const monthlyChartData = useMemo(() => {
    const now = new Date();
    const months: { name: string; kosten: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMM', { locale: de });

      const costs = wartungsdurchfuehrung
        .filter(wd => {
          if (!wd.fields.durchfuehrungsdatum) return false;
          return wd.fields.durchfuehrungsdatum.startsWith(monthKey);
        })
        .reduce((sum, wd) => sum + (wd.fields.gesamtkosten || 0), 0);

      months.push({ name: monthLabel, kosten: costs });
    }

    return months;
  }, [wartungsdurchfuehrung]);

  // Get upcoming maintenance (planned or confirmed, sorted by date)
  const upcomingMaintenance = useMemo(() => {
    return wartungsplanung
      .filter(wp => wp.fields.planungsstatus === 'geplant' || wp.fields.planungsstatus === 'bestaetigt')
      .sort((a, b) => {
        const dateA = a.fields.geplantes_datum || '';
        const dateB = b.fields.geplantes_datum || '';
        if (dateA !== dateB) return dateA.localeCompare(dateB);
        // Secondary sort by priority
        const priorityOrder = { dringend: 0, hoch: 1, normal: 2, niedrig: 3 };
        const prioA = priorityOrder[a.fields.prioritaet as keyof typeof priorityOrder] ?? 2;
        const prioB = priorityOrder[b.fields.prioritaet as keyof typeof priorityOrder] ?? 2;
        return prioA - prioB;
      })
      .slice(0, 10)
      .map(wp => {
        const busId = extractRecordId(wp.fields.bus);
        const wartungstypId = extractRecordId(wp.fields.wartungstypen);
        return {
          ...wp,
          busData: busId ? busseMap.get(busId) : null,
          wartungstypData: wartungstypId ? wartungstypenMap.get(wartungstypId) : null,
        };
      });
  }, [wartungsplanung, busseMap, wartungstypenMap]);

  // Get recent maintenance (sorted by date, most recent first)
  const recentMaintenance = useMemo(() => {
    return wartungsdurchfuehrung
      .sort((a, b) => {
        const dateA = a.fields.durchfuehrungsdatum || '';
        const dateB = b.fields.durchfuehrungsdatum || '';
        return dateB.localeCompare(dateA);
      })
      .slice(0, 5)
      .map(wd => {
        const busId = extractRecordId(wd.fields.bus);
        const wartungstypId = extractRecordId(wd.fields.wartungstypen);
        return {
          ...wd,
          busData: busId ? busseMap.get(busId) : null,
          wartungstypData: wartungstypId ? wartungstypenMap.get(wartungstypId) : null,
        };
      });
  }, [wartungsdurchfuehrung, busseMap, wartungstypenMap]);

  // Count of upcoming maintenance
  const upcomingCount = wartungsplanung.filter(
    wp => wp.fields.planungsstatus === 'geplant' || wp.fields.planungsstatus === 'bestaetigt'
  ).length;

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={fetchData} />;
  if (busse.length === 0) return <EmptyState />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bus className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Fuhrpark</h1>
          </div>
          <AddMaintenanceDialog
            busse={busse}
            wartungstypen={wartungstypen}
            onSuccess={fetchData}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section - Attention Count */}
        <div className="mb-6">
          <Card className={`overflow-hidden ${attentionCount > 0 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' : ''}`}>
            <CardContent className="py-8 text-center">
              <div className={`text-6xl md:text-7xl font-bold mb-2 ${attentionCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {attentionCount}
              </div>
              <div className="text-muted-foreground text-lg">
                Fahrzeuge brauchen Aufmerksamkeit
              </div>
              {attentionCount > 0 && (
                <div className="mt-3 text-sm text-muted-foreground">
                  {fleetStatus.in_wartung > 0 && <span>{fleetStatus.in_wartung} in Wartung</span>}
                  {fleetStatus.in_wartung > 0 && fleetStatus.ausser_betrieb > 0 && <span>, </span>}
                  {fleetStatus.ausser_betrieb > 0 && <span>{fleetStatus.ausser_betrieb} außer Betrieb</span>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fleet Status Pills - Horizontal scroll on mobile */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {Object.entries(STATUS_LABELS).map(([status]) => (
              <FleetStatusPill
                key={status}
                status={status}
                count={fleetStatus[status]}
                total={busse.length}
              />
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gesamtflotte</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{busse.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Fahrzeuge</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wartungskosten</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(currentMonthCosts)}</div>
              <p className="text-xs text-muted-foreground mt-1">diesen Monat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Anstehend</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{upcomingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">geplante Wartungen</p>
            </CardContent>
          </Card>
        </div>

        {/* Desktop: Two columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly costs chart - hidden on mobile */}
            <Card className="hidden md:block">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Wartungskosten pro Monat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        stroke="hsl(220 10% 45%)"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="hsl(220 10% 45%)"
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), 'Kosten']}
                        contentStyle={{
                          backgroundColor: 'hsl(0 0% 100%)',
                          border: '1px solid hsl(220 15% 88%)',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar
                        dataKey="kosten"
                        fill="hsl(220 65% 45%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Maintenance Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold">Anstehende Wartungen</CardTitle>
                  <Badge variant="secondary">{upcomingCount}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingMaintenance.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Keine anstehenden Wartungen</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile: Cards */}
                    <div className="md:hidden space-y-3">
                      {upcomingMaintenance.map(item => (
                        <div
                          key={item.record_id}
                          className={`p-3 rounded-lg border bg-card ${
                            item.fields.prioritaet === 'dringend' ? 'border-l-4 border-l-amber-500' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-semibold">
                                {item.busData?.fields.fahrzeugnummer || '-'}
                              </span>
                              <span className="text-muted-foreground ml-2">
                                {item.busData?.fields.kennzeichen || ''}
                              </span>
                            </div>
                            <PriorityBadge priority={item.fields.prioritaet} />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.wartungstypData?.fields.bezeichnung || '-'}
                          </div>
                          <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDate(item.fields.geplantes_datum)}
                            </span>
                            <StatusBadge status={item.fields.planungsstatus} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop: Table */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fahrzeug</TableHead>
                            <TableHead>Wartungstyp</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead>Priorität</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingMaintenance.map(item => (
                            <TableRow
                              key={item.record_id}
                              className="hover:bg-muted/50 cursor-pointer"
                            >
                              <TableCell>
                                <div className="font-medium">
                                  {item.busData?.fields.fahrzeugnummer || '-'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.busData?.fields.kennzeichen || ''}
                                </div>
                              </TableCell>
                              <TableCell>{item.wartungstypData?.fields.bezeichnung || '-'}</TableCell>
                              <TableCell>{formatDate(item.fields.geplantes_datum)}</TableCell>
                              <TableCell><PriorityBadge priority={item.fields.prioritaet} /></TableCell>
                              <TableCell><StatusBadge status={item.fields.planungsstatus} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Recent Maintenance */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Letzte Wartungen</CardTitle>
              </CardHeader>
              <CardContent>
                {recentMaintenance.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Keine Wartungen erfasst</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] lg:h-auto">
                    <div className="space-y-4">
                      {recentMaintenance.map(item => (
                        <div
                          key={item.record_id}
                          className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">
                              {item.busData?.fields.fahrzeugnummer || '-'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(item.fields.durchfuehrungsdatum)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {item.wartungstypData?.fields.bezeichnung || '-'}
                          </div>
                          {item.fields.gesamtkosten && (
                            <div className="text-sm font-semibold text-primary">
                              {formatCurrency(item.fields.gesamtkosten)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile: Fixed bottom action button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <AddMaintenanceDialog
          busse={busse}
          wartungstypen={wartungstypen}
          onSuccess={fetchData}
        />
      </div>

      {/* Spacer for mobile fixed button */}
      <div className="md:hidden h-20" />
    </div>
  );
}
