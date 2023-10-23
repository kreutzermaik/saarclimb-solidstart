type ButtonProps = {
  text: string,
  type: string,
  outline?: string,
  rounded?: string,
  onClick?: any,
  width?: string,
  opacity?: string,
  textSize?: string,
  paddingX?: string,
  disabled?: boolean
}

export function Button(props: ButtonProps) {

  function handleClick() {
    props.onClick();
  }

  return (
    <button 
      onClick={handleClick}
      disabled={props.disabled}
      type="button" 
      class={`bg-${props.type} ${props.width} ${props.opacity} ${props.paddingX} ${props.textSize} ${(props.outline) ? 'btn-outline border' : ''} ${(props.rounded) ? 'rounded-full' : 'rounded-lg'} text-white text-sm focus:ring-4 font-medium px-5 py-2 mr-2 mb-2 focus:outline-none`}
    >
      {props.text}
    </button>
  );
}
