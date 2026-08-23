#include <filesystem>
#include <iostream>
#include <string>
int main(){
  namespace fs=std::filesystem;
  int photos=0; for(auto &e:fs::directory_iterator("assets")) if(e.path().extension()==".webp" && e.path().filename().string().rfind("p",0)==0) ++photos;
  bool music=fs::exists("assets/audio_3.mp3"); bool v2=fs::exists("assets/v02.mp4"); bool v3=fs::exists("assets/v03.mp4");
  std::cout<<"AKKU asset probe\nphotos="<<photos<<"\nJaavedaan="<<(music?"OK":"MISSING")<<"\nvideo2="<<(v2?"OK":"MISSING")<<"\nvideo3="<<(v3?"OK":"MISSING")<<"\n";
  return (photos==26 && music && v2 && v3)?0:1;
}
