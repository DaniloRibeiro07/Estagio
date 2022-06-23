void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(2, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available()>0){
    char c=Serial.read();
    if (c=='\n'){
      Serial.println("ok");
      delay(10);
    }
  }  
}
