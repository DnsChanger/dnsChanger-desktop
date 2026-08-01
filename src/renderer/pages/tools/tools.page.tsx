import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { FiChevronRight } from 'react-icons/fi'
import { IoArrowBack } from 'react-icons/io5'
import { tools, type ToolDefinition } from './tools.registry'

export function ToolsPage() {
	const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null)

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
			<div className="w-full h-full p-3 bg-base-300">
				<div className="max-w-2xl mx-auto space-y-3 pb-20">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => setActiveTool(null)}
							className="btn btn-ghost btn-sm rounded-xl gap-1.5 text-base-content/70 hover:text-base-content"
						>
							<IoArrowBack size={16} />
							<span>Back</span>
						</button>
						<div className="h-4 w-px bg-base-content/10" />
						<div className="flex items-center gap-2">
							<span className={`text-base ${activeTool.iconColor}`}>
								{React.createElement(activeTool.icon)}
							</span>
							<h2 className="text-sm font-semibold text-base-content">
								{activeTool.name}
							</h2>
						</div>
					</div>

					{React.createElement(activeTool.component)}
				</div>
			</div>
		)
	}

	return (
		<div className="w-full h-full p-3 overflow-y-auto bg-base-300">
			<div className="max-w-2xl mx-auto space-y-4 pb-20">
				<div className="px-1">
					<h1 className="text-base font-bold text-base-content leading-tight">
						Tools
					</h1>
					<p className="text-xs text-base-content/60 mt-0.5">
						System utilities and management tools
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{tools.map((tool) => (
						<button
							key={tool.key}
							type="button"
							onClick={() => handleSelectTool(tool)}
							className="flex items-center justify-between p-3 border rounded-2xl bg-base-100 border-base-300 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer text-left group"
						>
							<div className="flex items-center gap-3.5 min-w-0">
								<div
									className={`p-2.5 rounded-xl bg-base-200 group-hover:bg-primary/10 transition-colors ${tool.iconColor} shrink-0`}
								>
									{React.createElement(tool.icon, { size: 20 })}
								</div>
								<div className="min-w-0">
									<h3 className="text-sm font-semibold text-base-content leading-tight group-hover:text-primary transition-colors">
										{tool.name}
									</h3>
									<p className="text-xs text-base-content/60 mt-1 leading-snug line-clamp-2">
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
