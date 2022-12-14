#import "VnpayMerchant.h"
#import <CallAppSDK/CallAppInterface.h>

@interface VnpayMerchant()

@property (nonatomic, strong) UIWindow *window1;

@end

@implementation VnpayMerchant

RCT_EXPORT_MODULE();
- (NSArray<NSString *> *)supportedEvents {
    return @[@"PaymentBack"];
}
RCT_EXPORT_METHOD(show:(NSString *)scheme 
                  isSandbox:(BOOL )isSandbox
                  paymentUrl:(NSString *)paymentUrl
                  tmn_code:(NSString *)tmn_code
                  backAlert:(NSString *)backAlert
                  title:(NSString *)title
                  titleColor:(NSString *)titleColor
                  beginColor:(NSString *)beginColor
                  endColor:(NSString *)endColor
                  iconBackName:(NSString *)iconBackName
                  )
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sdkAction:) name:@"SDK_COMPLETED" object:nil];
        
        CGFloat width = [UIScreen mainScreen].bounds.size.width;
        CGFloat height = [UIScreen mainScreen].bounds.size.height;
        
        self.window1 = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, width, height)];
        self.window1.backgroundColor = UIColor.clearColor;
        self.window1.windowLevel = UIWindowLevelAlert;
        self.window1.rootViewController = [[UIViewController alloc] init];
        self.window1.rootViewController.view.backgroundColor = UIColor.clearColor;
        [self.window1 makeKeyAndVisible];
        
        [CallAppInterface setHomeViewController:self.window1.rootViewController];
        [CallAppInterface setSchemes:scheme];
        [CallAppInterface setIsSandbox:isSandbox];
        [CallAppInterface setAppBackAlert:backAlert];
        [CallAppInterface showPushPaymentwithPaymentURL:paymentUrl
                                              withTitle:title
                                           iconBackName:iconBackName
                                             beginColor:beginColor
                                               endColor:endColor
                                             titleColor:titleColor
                                               tmn_code:tmn_code];
    });
}



-(void)sdkAction:(NSNotification*)notification {
    if ([notification.name isEqualToString:@"SDK_COMPLETED"]){
        self.window1.hidden = YES;
        self.window1 = nil;
        
        NSString *actionValue=[notification.object valueForKey:@"Action"];
        if ([@"AppBackAction" isEqualToString:actionValue]) {
            //Ng?????i d??ng nh???n back t??? sdk ????? quay l???i
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@-1}];
            return;
        }
        if ([@"CallMobileBankingApp" isEqualToString:actionValue]) {
            //Ng?????i d??ng nh???n ch???n thanh to??n qua app thanh to??n (Mobile Banking, V??...)
            //l??c n??y app t??ch h???p s??? c???n l??u l???i c??i PNR, khi n??o ng?????i d??ng m??? l???i app t??ch h???p th?? s??? g???i ki???m tra tr???ng th??i thanh to??n c???a PNR ???? xem ???? thanh to??n hay ch??a.
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@10}];
            return;
        }
        if ([@"WebBackAction" isEqualToString:actionValue]) {
            //Ng?????i d??ng nh???n back t??? trang thanh to??n th??nh c??ng khi thanh to??n qua th??? khi g???i ?????n http://sdk.merchantbackapp
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@99}];
            return;
        }
        if ([@"FaildBackAction" isEqualToString:actionValue]) {
            //giao d???ch thanh to??n b??? failed
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@98}];
            return;
        }
        if ([@"SuccessBackAction" isEqualToString:actionValue]) {
            //thanh to??n th??nh c??ng tr??n webview
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@97}];
            return;
        }
    }
}
@end
