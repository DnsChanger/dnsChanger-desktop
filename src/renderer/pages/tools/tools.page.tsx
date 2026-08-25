import React, { useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga4'
import { FiChevronRight } from 'react-icons/fi'
import { IoArrowBack } from 'react-icons/io5'
import { tools, type ToolDefinition } from './tools.registry'

export function ToolsPage() {
	const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null)

	const currentPlatform = useMemo(() => {
		return window.os?.os || 'win32'
	}, [])

	const availableTools = useMemo(() => {
		return tools.filter((tool) => tool.platforms.includes(currentPlatform as any))
	}, [currentPlatform])

	useEffect(() => {
		if (activeTool) {
			ReactGA.send({
				hitType: 'pageview',
				page: `/tools/${activeTool.key}`,
				title: `Tool - ${activeTool.name}`,
			})
		} else {
			ReactGA.send({
				hitType: 'pageview',
				page: '/tools',
				title: 'Tools',
			})
		}
	}, [activeTool])

	const handleSelectTool = (tool: ToolDefinition) => {
		ReactGA.event({
			category: 'Tools',
			action: 'OPEN_TOOL',
			label: tool.name,
		})
		setActiveTool(tool)
	}

	if (activeTool) {
		return (
			<div className="flex flex-col w-full h-full p-3 overflow-hidden bg-base-300">
				<div className="flex flex-col w-full h-full max-w-2xl pb-0 mx-auto space-y-3">
					<div className="flex items-center gap-3 shrink-0">
						<button
							type="button"
							onClick={() => setActiveTool(null)}
							className="btn btn-ghost btn-sm rounded-xl gap-1.5 text-base-content/70 hover:text-base-content"
						>
							<IoArrowBack size={16} />
							<span>Back</span>
						</button>
						<div className="w-px h-4 bg-base-content/10" />
						<div className="flex items-center gap-2">
							<span className={`text-base ${activeTool.iconColor}`}>
								{React.createElement(activeTool.icon)}
							</span>
							<h2 className="text-sm font-semibold text-base-content">
								{activeTool.name}
							</h2>
						</div>
					</div>

					<div className="flex-1 h-full min-h-0 overflow-hidden">
						{React.createElement(activeTool.component)}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full h-full p-3 overflow-y-auto bg-base-300">
			<div className="max-w-2xl pb-20 mx-auto space-y-4">
				<div className="px-1">
					<h1 className="text-base font-bold leading-tight text-base-content">
						Tools
					</h1>
					<p className="text-xs text-base-content/60 mt-0.5">
						System utilities and management tools
					</p>
				</div>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{availableTools.map((tool) => (
						<button
							key={tool.key}
							type="button"
							onClick={() => handleSelectTool(tool)}
							className="flex items-center justify-between p-3 text-left transition-all duration-200 border shadow-sm cursor-pointer rounded-2xl bg-base-100 border-base-300 hover:shadow-md hover:border-primary/40 group"
						>
							<div className="flex items-center gap-3.5 min-w-0">
								<div
									className={`p-2.5 rounded-xl bg-base-200 group-hover:bg-primary/10 transition-colors ${tool.iconColor} shrink-0`}
								>
									{React.createElement(tool.icon, { size: 20 })}
								</div>
								<div className="min-w-0">
									<h3 className="text-sm font-semibold leading-tight transition-colors text-base-content group-hover:text-primary">
										{tool.name}
									</h3>
									<p className="mt-1 text-xs leading-snug text-base-content/60 line-clamp-2">
										{tool.description}
									</p>
								</div>
							</div>

							<FiChevronRight
								size={18}
								className="text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
							/>
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
