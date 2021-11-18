import * as React from "react"
import Glide from "@glidejs/glide"
import './carousel.css'

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
			<div className="glide__arrows" data-glide-el="controls">
				<button className="glide__arrow glide__arrow--left" data-glide-dir="<">
					<i className="icon icon-arrow-left">prev</i>
				</button>
				<button className="glide__arrow glide__arrow--right" data-glide-dir=">">
					<i className="icon icon-arrow-right">next</i>
				</button>
			</div>
			{ options.showNav === true &&
				<div class="glide__bullets" data-glide-el="controls[nav]">
					{ children.map((el, i) => (
							<button class="glide__bullet" data-glide-dir={`=${i}`}></button>
						)) 
					}
				</div>	
			}
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