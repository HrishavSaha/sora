import Image from "next/image";
import { InstagramLogo, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import PostcardFrame from "@/components/postcard-frame";

const contactChannels = [
	{ label: "@sorawear", href: "https://instagram.com/sorawear", Icon: InstagramLogo },
	{ label: "+1 234 567 8900", href: "https://wa.me/12345678900", Icon: WhatsappLogo },
	{ label: "+1 234 567 8900", href: "tel:+12345678900", Icon: Phone },
];

export default function ContactHero() {
	return (
		<section className="relative flex min-h-screen flex-col justify-end overflow-hidden">
			<Image
				src="/images/contact-bg.jpg"
				alt="Woman meditating on the beach at dusk"
				fill
				priority
				sizes="100vw"
				className="object-cover"
			/>
			<div className="absolute inset-0 bg-primary/10" />
			<div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent" />
			<div className="absolute inset-x-0 bottom-0 h-72 bg-linear-to-t from-black/70 to-transparent" />

			<div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-28">
				<PostcardFrame className="w-full max-w-lg bg-secondary p-10 md:p-12">
					<h1 className="font-serif text-4xl italic leading-[1.1] text-primary md:text-5xl">
						Contact Us
					</h1>
					<p className="mt-3 text-sm leading-relaxed text-primary/80 md:text-base">
						Questions about sizing, an order, or just want to say hello? Send us a
						message and we will get back to you soon.
					</p>

					<form className="mt-8 flex flex-col gap-5">
						<div className="flex flex-col gap-2">
							<label htmlFor="contact-name" className="font-montserrat text-xs uppercase tracking-[0.15em] text-primary/70">
								Full Name
							</label>
							<input
								id="contact-name"
								type="text"
								name="name"
								required
								className="rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary outline-none placeholder:text-primary/40 focus:border-accent focus:ring-2 focus:ring-accent"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label htmlFor="contact-email" className="font-montserrat text-xs uppercase tracking-[0.15em] text-primary/70">
								Email
							</label>
							<input
								id="contact-email"
								type="email"
								name="email"
								required
								className="rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary outline-none placeholder:text-primary/40 focus:border-accent focus:ring-2 focus:ring-accent"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label htmlFor="contact-message" className="font-montserrat text-xs uppercase tracking-[0.15em] text-primary/70">
								Message
							</label>
							<textarea
								id="contact-message"
								name="message"
								required
								rows={4}
								className="resize-none rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary outline-none placeholder:text-primary/40 focus:border-accent focus:ring-2 focus:ring-accent"
							/>
						</div>
						<button
							type="submit"
							className="mt-2 inline-flex items-center justify-center self-start rounded-full bg-accent px-8 py-3 font-montserrat text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
						>
							Send Message
						</button>
					</form>
				</PostcardFrame>
			</div>

			<div className="relative z-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 pb-14 pt-10">
				{contactChannels.map(({ label, href, Icon }) => (
					<a
						key={href}
						href={href}
						target={href.startsWith("http") ? "_blank" : undefined}
						rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
						className="flex items-center gap-2 rounded-sm font-montserrat text-sm text-secondary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
					>
						<Icon size={20} weight="fill" />
						{label}
					</a>
				))}
			</div>
		</section>
	);
}
