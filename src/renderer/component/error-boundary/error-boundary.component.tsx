import React, { Component, type ReactNode } from 'react'
import {
	TbAlertTriangle,
	TbRefresh,
	TbFileText,
	TbBrandGithub,
	TbTerminal2,
} from 'react-icons/tb'
import { IoClose } from 'react-icons/io5'
import { VscChromeMinimize } from 'react-icons/vsc'

interface ErrorBoundaryProps {
	children: ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('Uncaught error in React render:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
		return (
			<div className="flex flex-col h-screen w-screen bg-base-300 select-none overflow-hidden font-[Inter]">
				<div className="bg-base-300 navbar h-10 min-h-10 px-3 flex items-center justify-between border-b border-base-content/5 [-webkit-app-region:drag]">
					<div className="flex items-center gap-2 pl-2">
						<span className="text-sm font-bold font-[balooTamma] text-base-content/70">
							DNS Changer
						</span>
					</div>
					<div className="flex items-center gap-1 [-webkit-app-region:no-drag]">
						<button
							className="btn btn-ghost btn-xs h-7 w-7 p-0 rounded-lg"
							onClick={() => window.ipc?.minimize?.()}
						>
							<VscChromeMinimize size={14} />
						</button>
						<button
							className="btn btn-ghost btn-xs h-7 w-7 p-0 rounded-lg hover:bg-error hover:text-white"
							onClick={() => window.ipc?.close?.()}
						>
							<IoClose size={16} />
						</button>
					</div>
				</div>

				<div className="flex-1 flex items-center justify-center p-6">
					<div className="bg-base-100 border border-base-300 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
						<div className="w-14 h-14 rounded-2xl bg-error/15 text-error flex items-center justify-center mb-3">
							<TbAlertTriangle size={28} />
						</div>

						<h2 className="text-lg font-bold font-[balooTamma] text-base-content mb-1">
							Something went wrong
						</h2>
						<p className="text-xs text-base-content/60 leading-relaxed mb-6">
							An unexpected error occurred. You can reload the app or open the log file to see details.
						</p>

						<div className="grid grid-cols-2 gap-2 w-full">
							<button
								className="btn btn-sm btn-primary rounded-xl gap-1.5 font-medium col-span-2"
								onClick={() => window.location.reload()}
							>
								<TbRefresh size={16} />
								Reload App
							</button>
							<button
								className="btn btn-sm bg-base-200 hover:bg-base-300 border-base-300 rounded-xl gap-1.5 font-normal text-xs text-base-content/80"
								onClick={() => window.ipc?.openLogFile?.()}
							>
								<TbFileText size={15} />
								Open Log
							</button>
							<button
								className="btn btn-sm bg-base-200 hover:bg-base-300 border-base-300 rounded-xl gap-1.5 font-normal text-xs text-base-content/80"
								onClick={() => window.ipc?.openDevTools?.()}
							>
								<TbTerminal2 size={15} />
								Dev Tools
							</button>
							<button
								className="btn btn-sm bg-base-200 hover:bg-base-300 border-base-300 rounded-xl gap-1.5 font-normal text-xs text-base-content/80 col-span-2"
								onClick={() =>
									window.ipc?.openBrowser?.(
										'https://github.com/DnsChanger/dnsChanger-desktop'
									)
								}
							>
								<TbBrandGithub size={15} />
								GitHub
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

		return this.props.children
	}
}
