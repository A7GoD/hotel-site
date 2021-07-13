<template>
	<v-app>
		<div class="margin-box">
			<v-card>
				<div class="carousel-container">
					<v-carousel
						class="carousel-item"
						show-arrows-on-hover
						:show-arrows="false"
						:interval="4000"
						hide-delimiters
						cycle
						height="660px"
					>
						<v-carousel-item
							v-for="(hotelImage, i) in hotelImages"
							:key="i"
						>
							<v-img
								:src="hotelImageLocation + hotelImage"
								class="hotelImages"
							/>
						</v-carousel-item>
					</v-carousel>
				</div>
			</v-card>
		</div>
		<div class="floating-greeting">
			<v-card style="padding: 20px;">
				<v-card-text
					><h1><b>Welcome to Tha Hotel</b></h1>
					<br />
					<p style="font-size: 20px">
						Room booking service is now available. Hope you have a
						nice experience. For any queries, email us at
						<a
							href="#"
							style="text-decoration: none; cursor: pointer;"
							>helpdesk@thahotel.com</a
						>
					</p></v-card-text
				>
			</v-card>
		</div>
	</v-app>
</template>

<script>
export default {
	name: "About",
	data: () => ({
		hotelImageLocation: "hotelImages/",
		img: "img1.jpg",
		hotelImages: [
			"img1.jpg",
			"img2.jpg",
			"img3.jpg",
			"img4.jpg",
			"img5.jpg",
		],
	}),
};
</script>

<style>
.margin-box {
	padding: 50px;
	height: 100%;
	box-sizing: border-box;
}
.carousel-container {
	height: 100%;
}

.floating-greeting {
	width: 600px;
	height: max-content;
	z-index: 100;
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
</style>
