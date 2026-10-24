import type { ComponentType, SVGProps } from 'react';
import type { SvgIconProps } from '@mui/material';

import MonitorHeartRounded from '@mui/icons-material/MonitorHeartRounded';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import WidgetsRounded from '@mui/icons-material/WidgetsRounded';
import BusinessRounded from '@mui/icons-material/BusinessRounded';
import ApartmentRounded from '@mui/icons-material/ApartmentRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import KeyboardDoubleArrowLeftRounded from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import KeyboardDoubleArrowRightRounded from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import KeyboardDoubleArrowDownRounded from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import KeyboardDoubleArrowUpRounded from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import ViewColumnRounded from '@mui/icons-material/ViewColumnRounded';
import KeyboardCommandKeyRounded from '@mui/icons-material/KeyboardCommandKeyRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import FilterListRounded from '@mui/icons-material/FilterListRounded';
import FolderSpecialRounded from '@mui/icons-material/FolderSpecialRounded';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import AccountBalanceRounded from '@mui/icons-material/AccountBalanceRounded';
import LayersRounded from '@mui/icons-material/LayersRounded';
import SpaceDashboardRounded from '@mui/icons-material/SpaceDashboardRounded';
import AutorenewRounded from '@mui/icons-material/AutorenewRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import OpenInFullRounded from '@mui/icons-material/OpenInFullRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import MicRounded from '@mui/icons-material/MicRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import DesktopWindowsRounded from '@mui/icons-material/DesktopWindowsRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import MenuOpenRounded from '@mui/icons-material/MenuOpenRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import CategoryRounded from '@mui/icons-material/CategoryRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import SmartphoneRounded from '@mui/icons-material/SmartphoneRounded';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import HowToRegRounded from '@mui/icons-material/HowToRegRounded';
import GroupRounded from '@mui/icons-material/GroupRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import ShareRounded from '@mui/icons-material/ShareRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import UndoRounded from '@mui/icons-material/UndoRounded';
import UnfoldMoreRounded from '@mui/icons-material/UnfoldMoreRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import SortRounded from '@mui/icons-material/SortRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import CreditCardRounded from '@mui/icons-material/CreditCardRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import ImageRounded from '@mui/icons-material/ImageRounded';
import ElectricBoltRounded from '@mui/icons-material/ElectricBoltRounded';
import MovieRounded from '@mui/icons-material/MovieRounded';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

function wrapMui(MuiIcon: ComponentType<SvgIconProps>) {
  const Component = ({ className = '', size, strokeWidth, style, ...rest }: IconProps) => {
    const sizeStyle = size
      ? {
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          fontSize: typeof size === 'number' ? `${size}px` : size,
        }
      : {};

    return (
      <MuiIcon
        className={className}
        style={{ ...sizeStyle, ...style }}
        fontSize="inherit"
        {...(rest as SvgIconProps)}
      />
    );
  };
  Component.displayName = MuiIcon.displayName || 'MuiIconWrapper';
  return Component;
}

export const Activity = wrapMui(MonitorHeartRounded);
export const ArrowLeft = wrapMui(ArrowBackRounded);
export const ArrowUpDown = wrapMui(UnfoldMoreRounded);
export const ChevronsUpDown = wrapMui(UnfoldMoreRounded);
export const Bell = wrapMui(NotificationsNoneRounded);
export const Boxes = wrapMui(WidgetsRounded);
export const Building = wrapMui(BusinessRounded);
export const Building2 = wrapMui(ApartmentRounded);
export const Calendar = wrapMui(CalendarMonthRounded);
export const Check = wrapMui(CheckRounded);
export const CheckCircle2 = wrapMui(CheckCircleRounded);
export const ChevronDown = wrapMui(KeyboardArrowDownRounded);
export const ChevronUp = wrapMui(KeyboardArrowUpRounded);
export const ChevronLeft = wrapMui(ChevronLeftRounded);
export const ChevronRight = wrapMui(ChevronRightRounded);
export const ChevronsDown = wrapMui(KeyboardDoubleArrowDownRounded);
export const ChevronsUp = wrapMui(KeyboardDoubleArrowUpRounded);
export const ChevronsLeft = wrapMui(KeyboardDoubleArrowLeftRounded);
export const ChevronsRight = wrapMui(KeyboardDoubleArrowRightRounded);
export const Columns = wrapMui(ViewColumnRounded);
export const Command = wrapMui(KeyboardCommandKeyRounded);
export const ExternalLink = wrapMui(OpenInNewRounded);
export const Eye = wrapMui(VisibilityRounded);
export const Filter = wrapMui(FilterListRounded);
export const FolderKanban = wrapMui(FolderSpecialRounded);
export const GraduationCap = wrapMui(SchoolRounded);
export const Landmark = wrapMui(AccountBalanceRounded);
export const Layers = wrapMui(LayersRounded);
export const LayoutDashboard = wrapMui(SpaceDashboardRounded);
export const Loader2 = wrapMui(AutorenewRounded);
export const Lock = wrapMui(LockRounded);
export const LogOut = wrapMui(LogoutRounded);
export const MapPin = wrapMui(PlaceRounded);
export const Maximize2 = wrapMui(OpenInFullRounded);
export const Menu = wrapMui(MenuRounded);
export const Mic = wrapMui(MicRounded);
export const Minus = wrapMui(RemoveRounded);
export const Monitor = wrapMui(DesktopWindowsRounded);
export const Moon = wrapMui(DarkModeRounded);
export const MoreVertical = wrapMui(MoreVertRounded);
export const PanelLeftClose = wrapMui(MenuOpenRounded);
export const PanelLeftOpen = wrapMui(MenuRounded);
export const Pencil = wrapMui(EditRounded);
export const Plus = wrapMui(AddRounded);
export const RotateCcw = wrapMui(RestartAltRounded);
export const Save = wrapMui(SaveRounded);
export const Search = wrapMui(SearchRounded);
export const Settings = wrapMui(SettingsRounded);
export const Shapes = wrapMui(CategoryRounded);
export const Shield = wrapMui(ShieldRounded);
export const Smartphone = wrapMui(SmartphoneRounded);
export const Sparkles = wrapMui(AutoAwesomeRounded);
export const Sun = wrapMui(LightModeRounded);
export const Trash2 = wrapMui(DeleteOutlineRounded);
export const TrendingUp = wrapMui(TrendingUpRounded);
export const User = wrapMui(PersonRounded);
export const UserIcon = wrapMui(PersonRounded);
export const UserCheck = wrapMui(HowToRegRounded);
export const Users = wrapMui(GroupRounded);
export const X = wrapMui(CloseRounded);
export const AlertTriangle = wrapMui(WarningAmberRounded);
export const Copy = wrapMui(ContentCopyRounded);
export const Share2 = wrapMui(ShareRounded);
export const Undo2 = wrapMui(UndoRounded);
export const SlidersHorizontal = wrapMui(TuneRounded);
export const Sliders = wrapMui(TuneRounded);
export const SortDesc = wrapMui(SortRounded);
export const SortAsc = wrapMui(SortRounded);
export const ArrowDownAZ = wrapMui(SortRounded);
export const FileText = wrapMui(DescriptionRounded);
export const CreditCard = wrapMui(CreditCardRounded);
export const Star = wrapMui(StarRounded);
export const Image = wrapMui(ImageRounded);
export const ImageIcon = wrapMui(ImageRounded);
export const Unlock = wrapMui(LockRounded);
export const UploadCloud = wrapMui(ImageRounded);
export const AlertCircle = wrapMui(WarningAmberRounded);
export const ShieldCheck = wrapMui(ShieldRounded);
export const Compass = wrapMui(PlaceRounded);
export const Route = wrapMui(LayersRounded);
export const FileCheck2 = wrapMui(DescriptionRounded);
export const Zap = wrapMui(ElectricBoltRounded);
export const Film = wrapMui(MovieRounded);

export default {
  Activity,
  ArrowLeft,
  ArrowUpDown,
  Bell,
  Boxes,
  Building,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  ChevronsLeft,
  ChevronsRight,
  Columns,
  Command,
  ExternalLink,
  Eye,
  Filter,
  FolderKanban,
  GraduationCap,
  Landmark,
  Layers,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  Maximize2,
  Menu,
  Mic,
  Minus,
  Monitor,
  Moon,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings,
  Shapes,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
  User,
  UserIcon,
  UserCheck,
  Users,
  X,
};
