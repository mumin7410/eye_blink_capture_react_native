import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, CameraType } from 'expo-camera/legacy';
import * as FaceDetector from 'expo-face-detector';
import { useRef, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import ADLoading from './components/ADLoading';
import ADModal from './components/ADModal';

export default function App() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [blinkDetected, setBlinkDetected] = useState(false)
  const [openCamera, setopenCamera] = useState(false)
  const Cameraref = useRef(null)
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resStatus, setResStatus] = useState(''); 
  const [blinkCount, setBlinkCount] = useState(1); 

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const showModalForLimitedTime = () => {
    setModalVisible(true);
    setopenCamera(false)
    setTimeout(() => {
      setModalVisible(false);
    }, 3000); // Close the modal after 1.5 seconds
  };

  const BlinkToCapture = ({ faces }) => {
    if(faces.length > 0){
      // console.log('Left Eye =====> ',faces[0].leftEyeOpenProbability, 'Right Eye =====>', faces[0].rightEyeOpenProbability);
      const rightEye = faces[0].rightEyeOpenProbability;
      const leftEye = faces[0].leftEyeOpenProbability;
      const bothEyes = (rightEye + leftEye) / 2;
      if(bothEyes <= 0.3){
        setBlinkCount(prev => prev + 1)
        if(blinkCount >= 2){
          console.log(blinkCount)
          setBlinkCount(1)
          console.log('====================== Take image =====================')
          CaptureImage()
        }
      }
    }
  };

  const CaptureImage = async () => {
    const image = await Cameraref.current.takePictureAsync();
    const base64Image = await FileSystem.readAsStringAsync(image.uri, { encoding: FileSystem.EncodingType.Base64 });
    Send_image_to_backend(base64Image)
  }

  const Send_image_to_backend = async (base64Image) => {
    try {
      setLoading(true)
      const response = await axios.post('http://192.168.1.105:8000/find_emp/', {
        image: base64Image
      });
      console.log('Image upload response:', response.data.message);
      setResStatus(response.data.message)
    } catch (error) {
      console.error('Error uploading image:', error);
    }finally {
      setLoading(false);
      showModalForLimitedTime();
    }
  }

  const Check_phone_align = () => {
    // check phone alignment before detect eyes
  }
  
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <StatusBar backgroundColor="#FFF" translucent={true} />
          <>
            {/* Header */}
            <View style={styles.header_container}>
              <Text style={{ fontSize:18 }}>Attendance system</Text>
            </View>
            {/* Camera */}
            <View style={styles.body_container}>
              {loading ? <ADLoading />
              :<View>
                { openCamera ? 
                <>
                  <Text style={{ alignItems:'center', textAlign:'center' }}>Please blink eyes 2 times</Text>
                  <View style={styles.camera_container}>
                    <Camera
                      onFacesDetected={BlinkToCapture}
                      faceDetectorSettings={{
                        mode: FaceDetector.FaceDetectorMode.accurate,
                        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                        runClassifications: FaceDetector.FaceDetectorClassifications.all,
                        minDetectionInterval: 100,
                        tracking: true,
                      }}
                      style={{ width:'100%', height:'100%' }}
                      type={CameraType.front}
                      ref={Cameraref}
                    />
                     <Image
                      source={require('./assets/eye.png')}
                      style={styles.leftEye}
                      resizeMode="contain"
                    />
                    <Image
                      source={require('./assets/eye.png')}
                      style={styles.rightEye}
                      resizeMode="contain"
                    />
                  </View>
                </>
                :<></>
                }
                {/* Button */}
                {!openCamera ? <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.button}
                  onPress={() => {setopenCamera(true)}}
                >
                    <Text>Check in</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.button}
                  onPress={() => {setopenCamera(false)}}
                >
                    <Text>Cancle</Text>
                </TouchableOpacity>}
              </View>}
            </View>
          </>
          <ADModal modalVisible={modalVisible} Status={resStatus}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height * 1.05,
    backgroundColor:'#F5F8FF',
    paddingBottom:10,
  },
  
  header_container: {
    height:'12%',
    paddingTop:30,
    backgroundColor:'#FFF',
    alignItems:'center',
    justifyContent:'center',
    elevation:3
  },

  body_container:{
    height:'88%',
    justifyContent:'center'
  },

  camera_container:{
    height:'70%',
    marginVertical:15,
    backgroundColor:'#FFF',
    padding:20,
    borderRadius:20,
    elevation:5,
    shadowColor:'rgba(53, 130, 202, 0.15)',
    marginHorizontal:20
  },

  button:{
    padding:20,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FFFFFF',
    elevation:8,
    shadowColor:'rgba(53, 130, 202, 0.15)',
    borderRadius:20,
    marginBottom:9,
    marginHorizontal:20,
  },
  leftEye: {
    position: 'absolute',
    width: 45, // Adjust according to your image size and camera aspect ratio
    height: 45,
    zIndex: 10, // Ensure the image is above the camera
    top:180,
    left:105
  },
  rightEye: {
    position: 'absolute',
    width: 45, // Adjust according to your image size and camera aspect ratio
    height: 45,
    zIndex: 10, // Ensure the image is above the camera
    top:180,
    right:105
  },
});
