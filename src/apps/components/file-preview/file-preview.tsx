import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { ResizeMode, Video } from 'expo-av';

type FileType = 'image' | 'pdf' | 'video' | 'doc' | 'unknown';

interface FilePreviewProps {
  uri: string;
}

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const getFileType = (uri: string): FileType => {
  const ext = uri.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video';
  if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) return 'doc';
  return 'unknown';
};

const FilePreview: React.FC<FilePreviewProps> = ({ uri }) => {
  const type = getFileType(uri);

  switch (type) {
    case 'image':
      return (
        <Image
          source={{ uri }}
          style={{ minWidth: "100%", height: "100%" }}
        />
      );

    case 'pdf':
      return (
        <WebView
          source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(uri)}` }}
          style={{ flex: 1 }}
        />
      );

    case 'doc':
      return (
        <WebView
          source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(uri)}` }}
          style={{ flex: 1 }}
        />
      );

    case 'video':
      return (
        <Video
          source={{ uri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          useNativeControls
          style={{ width: "100%", height: "100%", }}
          resizeMode={ResizeMode.CONTAIN}
        />
      );

    default:
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text>Không hỗ trợ định dạng file này.</Text>
        </View>
      );
  }
};

export default FilePreview;
