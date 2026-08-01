interface ToggleSwitchProps {
	enabled: boolean
	disabled?: boolean
	loading?: boolean
	onToggle: () => void
}

export const ToggleSwitch = ({
	enabled,
	disabled = false,
	loading = false,
	onToggle,
}: ToggleSwitchProps) => {
	const getTrackStyle = () => {
		if (enabled) {
			return 'bg-primary'
		}

		return 'bg-base-300'
	}

	return (
		<div
			className={`
				w-10 h-6 relative rounded-full transition-colors duration-200
				${getTrackStyle()} cursor-pointer
				${disabled || loading ? 'cursor-not-allowed opacity-70' : ''}
				${!disabled && !loading ? 'active:scale-95' : ''}`}
			onClick={disabled || loading ? undefined : onToggle}
		>
			<span
				className={`absolute w-4 h-4 bg-white rounded-full shadow-sm top-1 left-1 transition-transform duration-300 ease-out ${
					enabled ? 'translate-x-4' : 'translate-x-0'
				} ${loading ? 'animate-bounce' : ''}`}
			/>
		</div>
	)
}
