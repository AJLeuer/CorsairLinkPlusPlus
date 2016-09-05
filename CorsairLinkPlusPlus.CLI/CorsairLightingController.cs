using System;
using System.Threading;
using CorsairLinkPlusPlus.Common;

namespace CorsairLinkPlusPlus.CLI
{
    public class CorsairLightingController {

        public CorsairLightingController() {
            
        }

        public void Start() {
           
            var device = RootDevice.GetInstance();
            device.Initialize();

            var i = 0;
        }
    }
}