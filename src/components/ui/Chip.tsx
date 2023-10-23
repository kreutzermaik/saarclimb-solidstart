type ChipProps = {
    text: string,
    color: string
  }
  
  export function Chip(props: ChipProps) {

    let color = '';
    switch (props.color) {
        case 'grün':
            color = 'bg-custom-green text-white border-2 border-gray-400';
            break;
        case 'gelb':
            color = 'bg-custom-yellow text-white border-2 border-gray-400';
            break;
        case 'orange':
            color = 'bg-custom-orange text-white border-2 border-gray-400';
            break;
        case 'blau':
            color = 'bg-custom-blue text-white border-2 border-gray-400';
            break;
        case 'weiß':
            color = 'bg-white text-black border-2 border-gray-400';
            break;
        case 'türkis':
            color = 'bg-custom-turquiose text-white border-2 border-gray-400';
            break;
        case 'schwarz':
            color = 'bg-black text-white border-2 border-gray-400';
            break;
        case 'rot':
            color = 'bg-custom-red text-white border-2 border-gray-400';
            break;
    }

    return (
      <div 
        class={`${color} p-2.5 rounded-md w-full`}
      >
        {props.text}
      </div>
    );
  }
  