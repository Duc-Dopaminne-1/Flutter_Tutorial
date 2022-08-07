import cv2
import numpy as np
import face_recognition
import os
from datetime import datetime

path = 'Image'
images = []
classNames = []
myList = os.listdir(path)
print('11' , myList)

#  myList array image input

for cl in myList:
    print('11 11', cl)
    # cl: name input
    curImg = cv2.imread(f'{path}/{cl}')
    # cv2.imread để load image từ path chỉ dinh  // https://www.geeksforgeeks.org/python-opencv-cv2-imread-method/
    # curImg: ket qua cv2 Phan Tich Image
    print('22', curImg)
    images.append(curImg)
    # add result Phan Tich Image vào mảng
    classNames.append(os.path.splitext(cl)[0])
    # add name image vao class

    print('33', classNames)


def findEncodings(images):
    encodeList = []
    for img in images:
        print('44', img)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # cv2.cvtColor chuyển đổi hệ màu # BGR -> RGB // https://eitguide.net/chuyen-doi-mau-trong-opencv/
        print('55', img)
        encode = face_recognition.face_encodings(img)[0]
        # mã hóa image
        print('66', encode)
        encodeList.append(encode)
    return encodeList


encodeListKnown = findEncodings(images)
# array data image đầu vào đã mã hóa
print('77', encodeListKnown)

cap = cv2.VideoCapture(0)
# open webcam

while True:
    success, img = cap.read()
    print('99', success)
    imgS = cv2.resize(img, (0,0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)
    # cv2.cvtColor chuyển đổi hệ màu ảnh trong camera # BGR -> RGB // https://eitguide.net/chuyen-doi-mau-trong-opencv/

    facesCurFrame = face_recognition.face_locations(imgS)
    # Tim vi tri khung hinh Khớp
    encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)
    print('1111', facesCurFrame)
    print('2222', encodesCurFrame)

    for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
        print('44444', encodeFace)
        print('5555', faceLoc)
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        # So sanh hinh vs image input ban dau
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        # tìm sự khác biệt giữa 2 khuôn mặt, con số càng nhỏ là càng giống

        print('6666', matches)
        print('77777', faceDis)
        matchIndex = np.argmin(faceDis)
        # trả về vị trí số bé nhất
        print('8888', matchIndex)

        if matches[matchIndex]:
            name = classNames[matchIndex].upper()
            y1, x2, y2, x1 = faceLoc
            y1, x2, y2 , x1 =  y1*4, x2*4, y2*4, x1*4
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
            cv2.putText(img, name, (x1 +6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1 , (255,255,255), 2)
            print(name)
    # Vẽ ô vuông màu xanh, quanh khuôn mặt
    cv2.imshow('Webcam', img)
    cv2.waitKey(1)
