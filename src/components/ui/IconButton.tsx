export function Button(props: any) {

    function handleClick() {
      props.onClick();
    }
  
    return (
      <button onClick={handleClick} type="button" class={`btn-${props.type} ${(props.outline) ? 'btn-outline border' : ''} btn-secondary text-white focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none`}>
        {props.text}
      </button>
    );
  }
  