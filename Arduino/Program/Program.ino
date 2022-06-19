void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(2, OUTPUT);
}

void loop() {
  static unsigned long tempo_ref=millis();
  // put your main code here, to run repeatedly:
  if ((millis()-tempo_ref)>2000){
    static unsigned long cont;
    Serial.print("Mensagem N°");
    Serial.println(cont++);
    tempo_ref=millis();
  }
  if (Serial.available()>0){
    Serial.print("Recebi: " + Serial.readString());
    static bool estado=1;
    digitalWrite(2, estado);
    estado=!estado;
  }
  
}
