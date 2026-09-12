"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

function buildScallopPath(width: number, height: number, targetDiameter: number) {
	const topCount = Math.max(2, Math.round(width / targetDiameter));
	const sideCount = Math.max(2, Math.round(height / targetDiameter));
	const topStep = width / topCount;
	const sideStep = height / sideCount;
	const rTop = topStep / 2;
	const rSide = sideStep / 2;

	// Each scallop is drawn as two quarter-circle arcs (rather than one semicircle) since
	// exact 180 degree arcs are numerically ambiguous and some browsers render them inverted.
	let d = "M 0 0 ";

	for (let i = 0; i < topCount; i++) {
		const x1 = i * topStep;
		const x2 = (i + 1) * topStep;
		const mid = (x1 + x2) / 2;
		d += `A ${rTop} ${rTop} 0 0 1 ${mid} ${rTop} A ${rTop} ${rTop} 0 0 1 ${x2} 0 `;
	}
	for (let i = 0; i < sideCount; i++) {
		const y1 = i * sideStep;
		const y2 = (i + 1) * sideStep;
		const mid = (y1 + y2) / 2;
		d += `A ${rSide} ${rSide} 0 0 1 ${width - rSide} ${mid} A ${rSide} ${rSide} 0 0 1 ${width} ${y2} `;
	}
	for (let i = 0; i < topCount; i++) {
		const x1 = width - i * topStep;
		const x2 = width - (i + 1) * topStep;
		const mid = (x1 + x2) / 2;
		d += `A ${rTop} ${rTop} 0 0 1 ${mid} ${height - rTop} A ${rTop} ${rTop} 0 0 1 ${x2} ${height} `;
	}
	for (let i = 0; i < sideCount; i++) {
		const y1 = height - i * sideStep;
		const y2 = height - (i + 1) * sideStep;
		const mid = (y1 + y2) / 2;
		d += `A ${rSide} ${rSide} 0 0 1 ${rSide} ${mid} A ${rSide} ${rSide} 0 0 1 0 ${y2} `;
	}
	d += "Z";
	return d;
}

type PostcardFrameProps = {
	children: ReactNode;
	className?: string;
	scallopSize?: number;
};

export default function PostcardFrame({ children, className = "", scallopSize = 26 }: PostcardFrameProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [path, setPath] = useState<string | null>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const update = () => {
			const { width, height } = el.getBoundingClientRect();
			if (width > 0 && height > 0) {
				setPath(buildScallopPath(width, height, scallopSize));
			}
		};

		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, [scallopSize]);

	return (
		<div
			ref={ref}
			className={className}
			style={{
				clipPath: path ? `path('${path}')` : undefined,
				filter: "drop-shadow(0 24px 45px rgba(0,0,0,0.28))",
			}}
		>
			{children}
		</div>
	);
}
