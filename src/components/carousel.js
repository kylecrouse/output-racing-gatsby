import Glide from "@glidejs/glide";
import * as React from "react";

import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

export const Carousel = React.forwardRef(({ options, children }, ref) => {
	const sliderRef = React.useRef();

	React.useImperativeHandle(ref, () => sliderRef.current);

	React.useEffect(() => {
		const slider = new Glide(sliderRef.current, options);

		slider.mount();

		return () => slider.destroy();
	}, [options]);

	return (
		<div className="glide" ref={sliderRef}>
			<div className="glide__track" data-glide-el="track">
				<ul className="glide__slides">{children}</ul>
			</div>
			<div class="glide__arrows" data-glide-el="controls">
				<button class="glide__arrow glide__arrow--left" data-glide-dir="<">
					<i className="icon icon-arrow-left">prev</i>
				</button>
				<button class="glide__arrow glide__arrow--right" data-glide-dir=">">
					<i className="icon icon-arrow-right">next</i>
				</button>
			</div>
		</div>
	);
});

export const Slide = React.forwardRef(({ children }, ref) => {
	return (
		<li className="glide__slide" ref={ref}>
			{children}
		</li>
	);
});