import {useCallback} from 'react';

export type StoredSceneInfosTypes = {
  hotSpotId: String,
  sceneId: String,
  xPercent: Number,
  yPercent: Number,
  linkToSceneId: String,
  text: String,
  type: String,
};

export type SceneInfosTypes = {
  show3D: Boolean,
  storedSceneInfos: StoredSceneInfosTypes[] | null,
  panoramaImageId: String | null,
  panoramaImageCode: String | null,
};

const returnError: SceneInfosTypes = {
  show3D: false,
  storedSceneInfos: null,
  panoramaImageId: null,
  panoramaImageCode: null,
};

export const convertYawPitchToXY = (containerWidth, containerHeight, yaw, pitch) => {
  try {
    return {
      x: (yaw / 360 + 0.5) * containerWidth,
      y: (pitch / -180 + 0.5) * containerHeight,
    };
  } catch {
    return {
      x: 0,
      y: 0,
    };
  }
};

const useGetSceneInfos = data => {
  const getSceneInfos = useCallback(() => {
    try {
      if (data) {
        if (data.errorMessage) {
          return returnError;
        }
        if (!data.panoramaImageDto?.panoramaImageJson) {
          return returnError;
        }
        const panoramaImageJson = JSON.parse(data.panoramaImageDto.panoramaImageJson);
        const sceneDtos = panoramaImageJson.scenes;
        const storedSceneInfos = sceneDtos.map(sceneDto => {
          const {hotSpots: hotSpotArr, ...hotSpotInfoData} = sceneDto;
          const sceneInfo = {
            ...hotSpotInfoData,
            hotSpots: hotSpotArr.reduce((obj, item) => {
              const {x: xPercent, y: yPercent} = convertYawPitchToXY(
                // to X Percent, Y Percent
                100, // 100 % width of container
                100, // 100 % height of container
                item.yaw,
                item.pitch,
              );
              const hotSpot = {
                hotSpotId: item.hotSpotId,
                sceneId: item.sceneId,
                xPercent,
                yPercent,
                linkToSceneId: item.linkToSceneId,
                text: item.text,
                type: item.type,
              };
              obj[item.hotSpotId] = hotSpot;
              return obj;
            }, {}),
          };
          return sceneInfo;
        });

        const mapData: SceneInfosTypes = {
          show3D: true,
          storedSceneInfos,
          panoramaImageId: data.panoramaImageDto.panoramaImageId,
          panoramaImageCode: data.panoramaImageDto.panoramaImageCode,
        };
        return mapData;
      } else {
        return returnError;
      }
    } catch (e) {
      return returnError;
    }
  }, [data]);

  return getSceneInfos();
};

export default useGetSceneInfos;
