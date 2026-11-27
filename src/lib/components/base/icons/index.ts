export { default as Icon } from './icon.svelte';

import type { Component } from 'svelte';
import {
	Circle,
	CircleAlert,
	CircleCheck,
	CircleX,
	CheckCheck,
	Clock,
	Check,
	CornerDownLeft,
	ChevronDown,
	Crown,
	Euro,
	Globe,
	HandCoins,
	Handshake,
	Inbox,
	Lightbulb,
	ListChecks,
	Loader,
	ListFilterPlus,
	Mailbox,
	MessageSquare,
	PanelRight,
	Pin,
	PinOff,
	Plus,
	ScanFace,
	ShieldCheck,
	ShieldOff,
	ShieldUser,
	Flag,
	Trophy,
	Users,
	UserRoundMinus,
	UserRoundCheck,
	type LucideProps,
	Search,
	Tag,
	Trash2,
	ArrowLeft,
	Send,
	ChevronRight,
	ChevronLeft,
	Lock,
	Info,
	Pencil,
	Ellipsis,
	X,
	Menu,
	Link,
	TriangleAlert,
	Building2,
	Coins,
	Target,
	Truck,
	Store,
	User,
	BadgeCheck,
	VolumeOff
} from '@lucide/svelte';
import Google from './google.svelte';
import CircleDashedSharp from './circle-dashed-sharp.svelte';

export type IconProps = LucideProps;

export type RegisteredIconNames =
	| 'arrow-left'
	| 'badge-check'
	| 'building-2'
	| 'circle'
	| 'circle-alert'
	| 'circle-check'
	| 'circle-x'
	| 'check'
	| 'check-check'
	| 'chevron-down'
	| 'corner-down-left'
	| 'coins'
	| 'chevron-right'
	| 'chevron-left'
	| 'circle-dashed-sharp'
	| 'clock'
	| 'crown'
	| 'ellipsis'
	| 'euro'
	| 'flag'
	| 'globe'
	| 'google'
	| 'hand-coins'
	| 'handshake'
	| 'inbox'
	| 'info'
	| 'lightbulb'
	| 'link'
	| 'list-checks'
	| 'list-filter-plus'
	| 'load'
	| 'lock'
	| 'mailbox'
	| 'menu'
	| 'message-square'
	| 'panel-right'
	| 'pin'
	| 'pin-off'
	| 'pencil'
	| 'plus'
	| 'search'
	| 'send'
	| 'scan-face'
	| 'shield-check'
	| 'shield-off'
	| 'shield-user'
	| 'store'
	| 'tag'
	| 'target'
	| 'trash-2'
	| 'triangle-alert'
	| 'truck'
	| 'trophy'
	| 'user'
	| 'users'
	| 'user-round-minus'
	| 'user-round-check'
	| 'volume-off'
	| 'x-close';

export const IconRegistry: Record<RegisteredIconNames, Component<IconProps>> = {
	'arrow-left': ArrowLeft,
	'badge-check': BadgeCheck,
	'building-2': Building2,
	circle: Circle,
	'circle-alert': CircleAlert,
	'circle-check': CircleCheck,
	'circle-x': CircleX,
	check: Check,
	'check-check': CheckCheck,
	'chevron-down': ChevronDown,
	'chevron-right': ChevronRight,
	'chevron-left': ChevronLeft,
	'corner-down-left': CornerDownLeft,
	coins: Coins,
	'circle-dashed-sharp': CircleDashedSharp,
	clock: Clock,
	crown: Crown,
	ellipsis: Ellipsis,
	euro: Euro,
	flag: Flag,
	google: Google,
	globe: Globe,
	'hand-coins': HandCoins,
	handshake: Handshake,
	inbox: Inbox,
	info: Info,
	lightbulb: Lightbulb,
	link: Link,
	'list-checks': ListChecks,
	'list-filter-plus': ListFilterPlus,
	load: Loader,
	lock: Lock,
	mailbox: Mailbox,
	menu: Menu,
	'message-square': MessageSquare,
	'panel-right': PanelRight,
	pin: Pin,
	'pin-off': PinOff,
	plus: Plus,
	pencil: Pencil,
	search: Search,
	send: Send,
	'scan-face': ScanFace,
	'shield-check': ShieldCheck,
	'shield-off': ShieldOff,
	'shield-user': ShieldUser,
	store: Store,
	tag: Tag,
	target: Target,
	'trash-2': Trash2,
	'triangle-alert': TriangleAlert,
	truck: Truck,
	trophy: Trophy,
	user: User,
	users: Users,
	'user-round-minus': UserRoundMinus,
	'user-round-check': UserRoundCheck,
	'volume-off': VolumeOff,
	'x-close': X
};
