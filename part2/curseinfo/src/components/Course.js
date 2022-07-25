const Course =({courses}) => {
    return(
     courses.map(course => {
       return(
         <div key={course.id}>
         <Header name={course.name} />
         <Content parts={course.parts} />
         <Total parts={course.parts} />
       </div>
       )
     })
    )
}
   const Header = ({name}) => <h2>{name}</h2>

   const Content =({parts}) => parts.map(part =><Part key={part.id} part={part}/>)

   const Part =({part}) => <p>{part.name} {part.exercises}</p>

   const Total =({parts}) => <p>Total sum of exercises {parts.reduce((sum, part) => part.exercises + sum, 0)}</p>

export default Course