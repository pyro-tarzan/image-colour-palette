"use client";
import { useState } from "react";
import styles from "./page.module.scss";

export default function Home() {
	const [file, setFile] = useState<File | null>(null);
	const [colors, setColors] = useState<[] | null>(null);
	const [imageSrc, setImageSrc] = useState("/images/default-image.jpg")

	const handleFileChange = (values: FileList | null) => {
		const selectedFile = values ? values[0] : null;

		if (selectedFile) {
			setFile(selectedFile);
		}

		console.log(selectedFile?.name)
	};

	const handleUpload = async() => {
		if (file) {
			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("http://127.0.0.1:5000/get-hex-colors", {
				method: "POST",
				body: formData
			});

			const { colors, image } = await res.json();
			setColors(colors);
			console.log(image)
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.pageBorder}>
				<div className={styles.pageContainer}>
					<h1 className={styles.titleheading}>Image Color Palette Generator</h1>
					<div className={styles.imagecont}>
						<div className={styles.inputCont}>
							<input
								className={styles.input}
								type="file"
								onChange={(e) => handleFileChange(e.target.files)}
							/>
							{file && !colors && (
							<div>
								<button 
									className={`${styles.button}`}
									onClick={handleUpload}
								>
									Upload
								</button>
							</div>
						)}
						</div>
					</div>
					
					<div className={styles.flexColors}>
						{colors && (
							<div className={styles.colorsCont}>
								{colors.map((color) => (
									<div 
										key={color[0]}
										className={styles.color}
										style={{backgroundColor: `${color[0]}`}}
									>
										{color[0]}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
