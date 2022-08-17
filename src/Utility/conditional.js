// Simple conditional wrapper

export const Conditional = ({...props}) => {
  return (
    props.condition && (props.children)
  )
}