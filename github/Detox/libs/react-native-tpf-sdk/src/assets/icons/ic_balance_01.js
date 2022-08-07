import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  const { color1 = '#DE761C', color2 = '#005E52', background = '#fff' } = props;
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M34.183 28.509h-.448a4.655 4.655 0 01-4.654-4.655v-.567h9.757v.567a4.655 4.655 0 01-4.655 4.655z"
        fill={color1}
      />
      <Path
        d="M35.174 23.287c.037 0 .067.03.067.066v.501a4.656 4.656 0 01-3.08 4.381 4.646 4.646 0 001.574.274h.448a4.655 4.655 0 004.655-4.655v-.567h-3.664zM6.265 28.509h-.448a4.655 4.655 0 01-4.655-4.655v-.567h9.757v.567a4.655 4.655 0 01-4.654 4.655z"
        fill={color1}
      />
      <Path d="M21.3 4.795h-2.6v29.909h2.6V4.795z" fill={background} />
      <Path d="M21.3 4.795H20v29.909h1.3V4.795z" fill={background} />
      <Path
        d="M29.018 37.347H10.982v-2.593c0-.657.532-1.189 1.189-1.189h15.658c.657 0 1.189.532 1.189 1.189v2.593zM20 5.305a2.363 2.363 0 100-4.727 2.363 2.363 0 000 4.727zM32.858 12.492a6.433 6.433 0 01-4.673-1.99 3.687 3.687 0 00-2.639-1.133H14.682c-1.167 0-2.25.47-3.052 1.323-1.073 1.144-2.63 1.8-4.27 1.8H1.84a.461.461 0 01-.462-.461v-1.38c0-.254.207-.46.461-.46h5.303c1.168 0 2.252-.47 3.052-1.324 1.074-1.144 2.63-1.8 4.27-1.8h11.07c1.642 0 3.198.656 4.271 1.8a4.145 4.145 0 003.053 1.323h5.302c.255 0 .462.207.462.462v1.379a.461.461 0 01-.462.46h-5.302z"
        fill={background}
      />
      <Path
        d="M27.83 33.565h-2.383l-.002.462a1.327 1.327 0 01-1.327 1.325H10.982v1.995h18.036v-2.594c0-.656-.532-1.188-1.189-1.188z"
        fill={background}
      />
      <Path
        d="M31.823 39.422H8.177V37.58c0-.673.545-1.22 1.218-1.22h21.21c.673 0 1.218.547 1.218 1.22v1.842z"
        fill={background}
      />
      <Path
        d="M31.82 38.708l.001-1.173a1.218 1.218 0 00-1.216-1.174h-2.416l-.002.517a1.215 1.215 0 01-1.215 1.214H8.177v1.33H31.823l-.004-.714z"
        fill={background}
      />
      <Path
        d="M39.416 23.282a.578.578 0 00-.002-.04l-.002-.019-.005-.033-.004-.025-.006-.024-.01-.033-.006-.017-.015-.038-.001-.004-4.5-9.98h3.295a1.04 1.04 0 001.04-1.038v-1.38a1.04 1.04 0 00-1.04-1.039h-5.303a3.573 3.573 0 01-2.63-1.14c-1.182-1.26-2.892-1.983-4.692-1.983h-3.657V5.204a2.936 2.936 0 001.063-2.262A2.945 2.945 0 0020 0a2.945 2.945 0 00-2.942 2.942c0 .908.414 1.722 1.064 2.262v1.285h-3.657c-1.8 0-3.51.723-4.692 1.983a3.573 3.573 0 01-2.63 1.14H1.838A1.04 1.04 0 00.8 10.652v1.379c0 .573.466 1.039 1.04 1.039h3.283L.635 23.05l-.002.004a.556.556 0 00-.014.036l-.007.019-.009.031-.006.026-.004.023-.005.035-.002.018a.583.583 0 00-.002.04v.572a5.239 5.239 0 005.233 5.233h.447a5.239 5.239 0 005.233-5.233v-.572a.557.557 0 00-.002-.04c0-.006 0-.012-.002-.019 0-.01-.003-.022-.005-.033 0-.008-.002-.017-.004-.025l-.006-.024-.01-.033-.006-.018a.574.574 0 00-.014-.037l-.002-.004-4.5-9.98h.414c1.8 0 3.51-.722 4.692-1.982a3.572 3.572 0 012.63-1.14h3.44v23.04H12.17c-.975 0-1.767.792-1.767 1.767v1.029H9.395c-.99 0-1.797.806-1.797 1.797v1.842c0 .32.26.578.578.578h23.647c.32 0 .578-.259.578-.578V37.58c0-.991-.806-1.797-1.797-1.797h-1.008v-1.03c0-.974-.793-1.766-1.767-1.766h-5.951V16.275a.578.578 0 00-1.156 0v16.712h-1.444V9.947h1.444v2.67a.578.578 0 001.156 0v-2.67h3.668c.827 0 1.637.348 2.222.956a7.006 7.006 0 005.09 2.167h.183l-4.488 9.98-.001.003a.523.523 0 00-.015.039l-.006.016-.01.034-.005.023-.005.026-.005.032-.001.02a.572.572 0 00-.002.039v.572a5.239 5.239 0 005.232 5.233h.448a5.239 5.239 0 005.233-5.233v-.572zM20 1.156a1.785 1.785 0 01.892 3.33c-.011.008-.023.014-.034.02-.03.018-.061.033-.093.048-.01.006-.022.01-.033.015-.025.012-.05.022-.076.032a1.842 1.842 0 01-.135.048l-.028.008a1.796 1.796 0 01-.087.023l-.03.007a1.798 1.798 0 01-.111.02l-.019.003a1.79 1.79 0 01-.363.013l-.03-.003a1.786 1.786 0 01-.1-.01l-.018-.003a1.798 1.798 0 01-.111-.02l-.03-.007a1.758 1.758 0 01-.087-.023l-.029-.008a1.807 1.807 0 01-.102-.035l-.033-.013-.074-.031-.035-.016a1.771 1.771 0 01-.092-.047l-.035-.02A1.785 1.785 0 0120 1.156zm.722 4.638v.695h-1.444v-.695l.029.006.132.029.043.008c.045.008.09.015.135.02l.032.004a2.96 2.96 0 00.701 0c.011 0 .022-.002.033-.004a2.9 2.9 0 00.134-.02l.044-.008c.045-.009.089-.019.132-.03l.029-.005zM6.264 27.93h-.447a4.081 4.081 0 01-4.077-4.066h8.6a4.081 4.081 0 01-4.076 4.066zm3.76-5.223H2.056l3.979-8.847 3.99 8.847zM21.3 34.143h6.53c.336 0 .61.274.61.61v1.03H16.369a.578.578 0 000 1.156H30.605c.353 0 .64.287.64.64v1.265H8.755V37.58c0-.354.287-.641.64-.641h3.282a.578.578 0 100-1.156H11.56v-1.03c0-.336.274-.61.61-.61h9.13zm11.558-22.23a5.86 5.86 0 01-4.257-1.812 4.267 4.267 0 00-3.055-1.31H14.682a4.717 4.717 0 00-3.473 1.505c-.964 1.028-2.367 1.618-3.849 1.618H1.956v-1.146h5.186a4.718 4.718 0 003.474-1.505c.964-1.028 2.367-1.618 3.849-1.618h11.07c1.482 0 2.884.59 3.849 1.618a4.718 4.718 0 003.474 1.505h5.185v1.146h-5.185zm1.096 1.948l3.989 8.847h-7.968l3.978-8.847zm.23 14.07h-.449a4.081 4.081 0 01-4.076-4.066h8.6a4.08 4.08 0 01-4.076 4.066z"
        fill={color2}
      />
    </Svg>
  );
}

export default SvgComponent;
