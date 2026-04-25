export type Testimonial = {
  testimonial : string,
  name : string,
  designation : string,
  image : string,
}

export const preTitle : string = "What others say about me"
export const title : string = "Testimonials"

export const testimonials : Testimonial[] = [
  {
    testimonial:
      "Oh yeah, I know him. He's a pretty chill guy.",
    name: "Alex",
    designation: "Waterloo student",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bHGb_Zk4zWeD4jw9ew8HboAT2zQIUZhYNA&s",
  },
  {
    testimonial:
      "Oh, him? He's my duo queue. I hope we get diamond this season.",
    name: "Artem",
    designation: "McGill student",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bHGb_Zk4zWeD4jw9ew8HboAT2zQIUZhYNA&s",
  },

];

