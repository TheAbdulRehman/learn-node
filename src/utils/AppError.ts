// Ye aam Error ka woh version hai jiske saath HTTP status code bhi chalta hai.
//
// Zaroorat kya thi: controller ke andar se "note nahi mili" batane ka tareeqa
// chahiye tha. Har controller mein khud res.status(404).json(...) likhne ke
// bajaye woh sirf error phenk dega, aur uska HTTP mein tarjuma ek hi jagah -
// errorHandler mein - hoga.
class AppError extends Error {
  public readonly statusCode: number;

  // Ye flag error handler ke liye hai. true ka matlab: ye error humne khud,
  // soch samajh kar phenki hai - is liye iska message client ko dikhana
  // mehfooz hai. Jo errors ye flag nahi rakhtin woh anjaan crashes hain,
  // unka message chhupana zaroori hai (usme file paths, SQL, wagaira ho sakta hai).
  public readonly isExpected = true;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export = AppError;
