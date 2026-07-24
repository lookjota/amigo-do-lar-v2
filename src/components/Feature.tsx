import img6 from '../assets/img6.jpg'
import img2 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'
import img4 from '../assets/img4.jpg'
import img5 from '../assets/img5.jpg'
import img7 from '../assets/img7.jpg'

const images = [img6, img2, img3, img4, img5, img7];


const Feature = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          className="w-full h-40 object-cover rounded-lg shadow-md"
        />
      ))}
    </div>
  )
}

export default Feature