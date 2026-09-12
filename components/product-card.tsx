import Image from "next/image";

export type Product = {
	name: string;
	price: number;
	image: string;
	badge?: string;
};

export default function ProductCard({ name, price, image, badge }: Product) {
	return (
		<article className="group">
			<div className="relative aspect-4/5 w-full">
				<div className="absolute inset-0 overflow-hidden rounded-2xl bg-secondary">
					<Image
						src={image}
						alt={name}
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="scale-[1.02] object-cover transition-transform duration-500 group-hover:scale-[1.08]"
					/>
					{badge && (
						<span className="absolute left-4 top-4 rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-montserrat uppercase tracking-wide text-primary">
							{badge}
						</span>
					)}
				</div>
				<span className="absolute -bottom-6 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent font-montserrat text-sm font-semibold text-secondary shadow-lg">
					${price}
				</span>
			</div>
			<div className="flex items-center justify-between gap-3 pt-10 pb-2">
				<h3 className="font-montserrat text-base font-medium leading-snug text-primary">
					{name}
				</h3>
				<button
					type="button"
					className="shrink-0 rounded-full border border-primary px-4 py-1.5 font-montserrat text-xs uppercase tracking-wide text-primary transition-colors duration-300 hover:bg-primary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
				>
					Add to cart
				</button>
			</div>
		</article>
	);
}
