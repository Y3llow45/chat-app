import { useNavigate } from 'react-router-dom'

const navWrap = WrappedComponent => props => {
  const navigate = useNavigate()

  return (
    <WrappedComponent
      {...props}
      {...{ navigate }}
    />
  )
}

export default navWrap
