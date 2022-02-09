import * as React from 'react'
import './car.css'

const Car = (props) => {
	// const image = `https://images-static.iracing.com${props.folder}/${props.smallImage}`
	const image = CARS[props.carId]?.image?.default
	return image ? (
		<figure key={props.carName} className="car-container">
			<img src={image} alt={props.carName} className="car-image" style={{ transform: props.transform, zIndex: props.zIndex }}/>
			<figcaption className="car-caption">{props.carName}</figcaption>
		</figure>
	) : null
}

export default Car

const CARS = {
	// "24": {
	// 		"name": "ARCA Menards Chevrolet Impala",
	// 		"image": "https://ir-core-sites.iracing.com/members/member_images/cars/impalanational/profile.jpg"
	// 	},
	// "45": {
	// 	"name": "[Legacy] NASCAR Cup Chevrolet SS - 2013",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/carid_45/profile.jpg"
	// },
	// "46": {
	// 	"name": "[Legacy] NASCAR Cup Ford Fusion - 2016",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/carid_46/profile.jpg"
	// },
	// "51": {
	// 	"name": "[Legacy] NASCAR Xfinity Ford Mustang - 2016",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/fordmustangclassb/profile.jpg"
	// },
	// "54": {
	// 	"name": "Super Late Model",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/superlatemodel/profile.jpg"
	// },
	// "56": {
	// 	"name": "NASCAR Cup Series Toyota Camry",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/carid_56/profile.jpg"
	// },
	// "58": {
	// 	"name": "[Legacy] NASCAR Xfinity Chevrolet Camaro - 2014",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/camaroclassb/profile.jpg"
	// },
	// "62": {
	// 	"name": "NASCAR Gander Outdoors Toyota Tundra",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/toyotatundra/profile.jpg"
	// },
	// "69": {
	// 	"name": "[Legacy] NASCAR Xfinity Toyota Camry - 2015",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/carid_69/profile.jpg"
	// },
	// "103": {
	// 	"name": "NASCAR Cup Series Chevrolet Camaro ZL1",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/carid_103/profile.jpg"
	// },
	// "110": {
	// 	"name": "NASCAR Cup Series Ford Mustang",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/carid_110/profile.jpg"
	// },
	// "111": {
	// 	"name": "NASCAR Gander Outdoors Chevrolet Silverado",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/carid_111/profile.jpg"
	// },
	// "123": {
	// 	"name": "NASCAR Gander Outdoors Ford F150",
	// 	"image": "https://ir-core-sites.iracing.com/members/member_images/cars/carid_123/profile.jpg"
	// },
	"51": {
		"name": "NASCAR Gander Outdoors Toyota Tundra",
		"image": require('../images/cars/car_51.png')
	},
	"91": {
		"name": "NASCAR Gander Outdoors Chevrolet Silverado",
		"image": require('../images/cars/car_91.png')
	},
	"105": {
		"name": "NASCAR Gander Outdoors Ford F150",
		"image": require('../images/cars/car_105.png')
	},
	"115": {
		"name": "NASCAR Cup Series Next Gen Chevrolet Camaro ZL1",
		"image": require('../images/cars/car_115.png')
	},
	"116": {
		"name": "NASCAR Cup Series Next Gen Ford Mustang",
		"image": require('../images/cars/car_116.png')
	},
	"117": {
		"name": "NASCAR Cup Series Next Gen Toyota Camry",
		"image": require('../images/cars/car_117.png')
	},
}