import {
  Home, Users, DollarSign, FileText, Activity, Settings, ChevronDown,
  UserPlus, Building2, GraduationCap, Calendar, CalendarDays, CalendarCheck,
  Folder, BookOpen, Star, BarChart2, TrendingUp, Award, Clock, Baby,
  Palette, Building, LogOut, Shield, FileBarChart, LayoutDashboard,
  ArrowRightLeft, UserMinus, RefreshCw, History, FileCheck, ClipboardList,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Home, Users, DollarSign, FileText, Activity, Settings, ChevronDown,
  UserPlus, Building2, GraduationCap, Calendar, CalendarDays, CalendarCheck,
  Folder, BookOpen, Star, BarChart2, TrendingUp, Award, Clock, Baby,
  Palette, Building, LogOut, Shield, FileBarChart, LayoutDashboard,
  ArrowRightLeft, UserMinus, RefreshCw, History, FileCheck, ClipboardList,
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className }: DynamicIconProps) {
  const Icon = ICON_MAP[name] ?? Home;
  return <Icon className={className} />;
}
